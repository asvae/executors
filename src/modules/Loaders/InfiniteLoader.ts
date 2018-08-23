import LadderExecutor from '../Executors/LadderExecutor'

export type PointerRequest = (pointer: number, perStep: number) => Promise<any[]>

export default class InfiniteLoader {
  public items: any[] = []
  public isFinished: boolean = false
  public isRefreshing: boolean = false

  protected readonly executor: LadderExecutor
  protected readonly perStep: number = 20 // number of items to load
  protected pointer: number = 0
  // Means no runs were executed
  protected isFresh: boolean = true
  // Is currently running from 0 pointer

  constructor (run: PointerRequest, perStep: number = 20) {
    this.executor = new LadderExecutor(async (refresh = false) => await this.runRequest(run, refresh))
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
   * Is false when executor is loading or is fresh.
   */
  get isEmpty (): boolean {
    if (this.executor.isRunning) {
      return false
    }
    return this.isFinished && (this.items.length === 0)
  }

  /**
   * We tried to load, and list is not empty
   * Is false when executor is loading or is fresh.
   */
  get isFull (): boolean {
    if (this.isFresh) {
      return false
    }
    if (this.executor.isRunning) {
      return false
    }
    return !!this.items.length
  }

  /**
   * Loads a bunch of items
   */
  public next (): void {
    this.executor.run()
  }

  /**
   * Refresh the list.
   */
  public refresh (): void {
    this.executor.run(true)
  }

  protected async runRequest (pointerRequest: PointerRequest, refresh = false): Promise<void> {
    if (this.pointer === 0) {
      refresh = true
    }
    if (refresh) {
      this.pointer = 0
      this.isFresh = true
      this.isRefreshing = true
      this.isFinished = false
    }
    try {
      const result = await pointerRequest(this.pointer, this.perStep)

      if (!Array.isArray(result)) {
        console.warn('InfiniteLoader function must return array')
        return
      }
      if (result.length < this.perStep) {
        this.isFinished = true
      }

      this.applyNew(result)
      this.pointer = this.pointer + this.perStep
      this.isFresh = false
    } catch (exception) {
      this.isFinished = true
      throw exception
    } finally {
      this.isRefreshing = false
    }
  }

  protected applyNew (items: any[]): void {
    if (this.isFresh) {
      this.items = items
      return
    }
    this.items = [...this.items, ...items]
  }
}
