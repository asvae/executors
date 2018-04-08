/**
 * Runs command on timeout.
 * Don't forget to stop it or executor would run indefinitely.
 */
export default class RepeatLoader {
  command: Function
  time: number = 100
  id: any = null

  constructor (command: Function, time: number) {
    this.command = command
    this.time = time
  }

  public start (): void {
    if (!this.id) {
      this.id = setInterval(this.command, this.time)
    }
  }

  public stop (): void {
    if (this.id) {
      clearInterval(this.id)
    }
    this.id = null
  }
}