export default class Executor {
  command: Function
  wasLastRunFine: boolean = false
  runCount: number = 0 // Currently active commands count
  wasRun: boolean = false
  wasRunFine: boolean = false
  wasRunBad: boolean = false

  constructor (command: (...args: any[]) => Promise<any> ) {
    this.command = command
  }

  get isRunning (): boolean {
    return !!this.runCount
  }

  /**
   * @protected
   */
  beforeRun (): void {
    this.runCount++
  }

  /**
   * @protected
   */
  afterRun (promise: Promise<any> ): void {
    promise.then(() => {
      this.runCount--
      this.setRunResultFlags(true)
    })
    promise.catch((result) => {
      this.runCount--
      this.setRunResultFlags(false)
    })
  }

  /**
   * @public
   */
  run (...parameters): Promise<any>  {
    this.beforeRun()
    const promise = this.command(...parameters)
    if (!(promise instanceof Promise)) {
      throw new Error('Executor command should return promise.')
    }
    this.afterRun(promise)
    return promise
  }

  /**
   * @protected
   */
  setRunResultFlags (success: boolean) {
    this.wasRun = true
    this.wasLastRunFine = success
    if (success) {
      this.wasRunFine = true
    }
    if (!success) {
      this.wasRunBad = true
    }
  }
}
