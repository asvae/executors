import AsyncHelpers from '../Helpers/AsyncHelpers'

export type RetrierExecutorCommand = () => boolean

export default class RetrierExecutor {
  protected command: RetrierExecutorCommand
  protected timeout: number
  protected maxTime: number
  public iterationCount: number = 0

  constructor (command: RetrierExecutorCommand, timeout: number = 100, maxTime: number = 1000) {
    this.command = command
    this.timeout = timeout
    this.maxTime = maxTime
  }

  /**
   * Shortcut to use executor functionally.
   */
  static async waitUntil (command: RetrierExecutorCommand, timeout?: number, maxTime?: number) {
    const executor = new RetrierExecutor(command, timeout, maxTime)
    await executor.run()
  }

  get timeElapsed () {
    return this.timeout * this.iterationCount
  }

  protected takesTooLong (): boolean {
    return this.timeElapsed > this.maxTime
  }

  async run (): Promise<void> {
    this.iterationCount = 0
    let result = this.command()
    while (!result) {
      await AsyncHelpers.sleep(this.timeout)
      this.iterationCount++
      if (this.takesTooLong()) {
        throw new Error(`Max time (${this.maxTime}) elapsed.`)
      }

      result = this.command()
    }
  }
}
