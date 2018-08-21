import LadderExecutor from '../Executors/LadderExecutor'

export type PointerRequest = (pointer: number, perStep: number) => Promise<any[]>

export default class InfiniteLoader {
  public items: any[] = []
  public isFinished: boolean = false

  protected readonly executor: LadderExecutor
  protected readonly perStep: number = 20 // number of items to load
  protected pointer: number = 0
  protected isFresh: boolean = true

  constructor (run: PointerRequest, perStep: number = 20) {
    this.executor = new LadderExecutor(async () => await this.runRequest(run))
    this.perStep = perStep
  }

  /**
   * Command from this executor is currently running.
   */
  get isRunning (): boolean {
    return this.executor.isRunning
  }

  /**
   * We tried to load, but list is empty
   */
  get isEmpty (): boolean {
    if (this.executor.isRunning) {
      return false
    }
    return this.isFinished && (this.items.length === 0)
  }

  /**
   * We tried to load, and list is not empty
   */
  get isFull (): boolean {
    return !!this.items.length
  }

  /**
   * Is loading anew. This could happen in two cases.
   * 1) Executor is running for the first time. Meaning the list is empty.
   * 2) Executor is refreshing. Meaning the list is not empty.
   */
  get isRefreshing (): boolean {
    return this.pointer === 0 && this.isRunning
  }

  /**
   * Loads a bunch of items
   */
  public next (): void {
    if (this.isRunning || this.isFinished) {
      return
    }
    this.isFresh = false

    this.executor.run()
  }

  protected async runRequest (pointerRequest: PointerRequest): Promise<void> {
    try {
      // We declare it here because concurrent reset might conflict when using increment
      const expectedPointer = this.pointer + this.perStep
      const result = await pointerRequest(this.pointer, this.perStep)

      if (!Array.isArray(result)) {
        console.warn('InfiniteLoader function must return array')
        return
      }
      if (result.length < this.perStep) {
        this.isFinished = true
      }
      this.pointer = expectedPointer
      this.applyNew(result)
    } catch (exception) {
      this.isFinished = true
      throw exception
    }
  }

  /**
   * Refresh the list.
   * This will replace current items with new ones after loading. Not clear the list immediately.
   */
  public refresh (): void {
    this.pointer = 0
    this.isFresh = true
    this.isFinished = false
    this.executor.run()
  }

  protected applyNew (items: any[]): void {
    if (this.isFresh) {
      this.items = items
      return
    }
    this.items = [...this.items, ...items]
  }
}
