import LadderExecutor from '../Executors/LadderExecutor'

export type PointerRequest = (pointer: number, perStep: number) => Promise<any[]>

export default class InfiniteLoader {
  public items: any[] = []

  protected pointer: number = 0
  protected executor: LadderExecutor
  protected perStep: number = 20 // number of items to load
  protected isFinished: Boolean = false
  protected isFresh: Boolean = true

  constructor (run: PointerRequest, perStep: number = 20) {
    this.executor = new LadderExecutor(run)
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
  public async next (): Promise<any[]> {
    if (this.isFinished) {
      return this.items
    }
    this.isFresh = false
    return this.runExecutor()
  }

  protected async runExecutor (): Promise<any[]> {
    const pointer = this.pointer
    await this.executor.run(pointer, this.perStep).then((result: any[]) => {
      if (!Array.isArray(result)) {
        console.warn('InfiniteLoader function must return array')
        return
      }
      if (result.length < this.perStep) {
        this.isFinished = true
      }
      this.pointer = pointer + this.perStep
      this.applyNew(result)
    }).catch((exception) => {
      this.isFinished = true
      throw exception
    })

    return this.items
  }

  /**
   * Refresh the list.
   * This will replace current items with new ones after loading. Not clear the list immediately.
   */
  public async refresh (): Promise<any[]> {
    this.pointer = 0
    this.isFresh = true
    this.isFinished = false
    return await this.runExecutor()
  }

  protected applyNew (items: any[]): void {
    if (this.isFresh) {
      this.items = items
      return
    }
    this.items = [...this.items, ...items]
  }
}
