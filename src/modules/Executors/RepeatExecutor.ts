export default class RepeatExecutor {
  command: Function
  time: number = 100
  id: any = null

  constructor (command: () => Promise<any>, time: number) {
    this.command = command
    this.time = time
  }

  public start () {
    if (!this.id) {
      this.id = setInterval(this.command, this.time)
    }
  }

  public stop () {
    if (this.id) {
      clearInterval(this.id)
    }
    this.id = null
  }
}