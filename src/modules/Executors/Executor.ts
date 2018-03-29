export default class Executor {
  protected command: Function

  wasLastRunFine: boolean = false //
  runCount: number = 0 // Currently active commands count
  wasRun: boolean = false // Executor was run at least once
  wasRunFine: boolean = false // Executor was without throwing error at least once
  wasRunBad: boolean = false //

  constructor (command: (...args: any[]) => Promise<any>) {
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
  afterRun (promise: Promise<any>): void {
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
  run (...parameters: any[]): Promise<any> {
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
