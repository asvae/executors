import AsyncHelpers from '../Helpers/AsyncHelpers'

export default class RetrierExecutor {
  protected command: () => boolean
  protected timeout: number
  protected maxTime: number
  public iterationCount: number = 0

  constructor (command: () => boolean, timeout: number = 100, maxTime: number = 1000) {
    this.command = command
    this.timeout = timeout
    this.maxTime = maxTime
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
