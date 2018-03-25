import LadderExecutor from '../Executors/LadderExecutor'

type PointerRequest = (pointer: number, perStep: number) => Promise<any[]>

export default class InfiniteLoader {
  items: any[] = []

  /**
   * @protected
   */
  pointer: number = 0

  /**
   * @protected
   */
  executor: LadderExecutor

  /**
   * @public
   */
  perStep: number = 20 // number of items to load

  /**
   * @protected
   */
  isFinished: Boolean = false

  /**
   * @protected
   */
  isFresh: Boolean = true

  constructor (run: PointerRequest, perStep: number = 20) {
    this.executor = new LadderExecutor(run)
    this.perStep = perStep
  }

  get isRunning (): boolean {
    return this.executor.isRunning
  }

  /**
   * Means we tried to load, but list is empty.
   */
  get isEmpty (): boolean {
    if (this.executor.isRunning) {
      return false
    }
    return this.isFinished && (this.items.length === 0)
  }

  /**
   * Means we tried to load, and list is full.
   */
  get isFull (): boolean {
    return !!this.items.length
  }

  /**
   * Means loads anew
   */
  get isRefreshing (): boolean {
    console.log('this.pointer', this.pointer)
    console.log('this.isRunning', this.isRunning)
    return this.pointer === 0 && this.isRunning
  }

  /**
   * Loads a bunch of items
   */
  next (): Boolean {
    console.log('this.pointer', this.pointer)
    if (this.isFinished) {
      return false
    }
    if (this.executor.isRunning) {
      return false
    }
    this.isFresh = false
    this.runExecutor()
    return true
  }

  runExecutor (): void {
    const pointer = this.pointer
    this.executor.run(pointer, this.perStep).then((result: any[]) => {
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
      // const response = exception.response
      this.isFinished = true
      throw exception
    })
  }

  refresh () {
    this.pointer = 0
    this.isFresh = true
    this.isFinished = false
    this.runExecutor()
  }

  /**
   * @protected
   */
  applyNew (items: any[]): void {
    if (this.isFresh) {
      this.items = items
      return
    }
    this.items = [...this.items, ...items]
  }
}
