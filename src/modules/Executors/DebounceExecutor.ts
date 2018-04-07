import Executor, { ExecutorCommand } from './Executor'

/**
 * When you `run` executor - timer is set on timeout value and starts ticking down.
 * If you `run` before the timer is expired - timer is refreshed.
 * When timer expires - command is being run.
 */
export default class DebounceExecutor {
  protected executor: Executor
  protected timeout: number

  protected identityCheck: {} = {}
  public isWaiting: boolean = false

  constructor (command: ExecutorCommand, timeout: number = 3000) {
    this.executor = new Executor(command)
    this.timeout = timeout
  }

  public get isRunning (): boolean {
    return this.executor.isRunning
  }

  public get isActive (): boolean {
    return this.isRunning || this.isWaiting
  }

  public getExecutor (): Executor {
    return this.executor
  }

  protected registerIdentity (): {} {
    this.identityCheck = {}
    return this.identityCheck
  }

  protected checkIdentity (key: {}): boolean {
    return this.identityCheck === key
  }

  public run (...parameters: any[]): void {
    this.isWaiting = true
    const identityKey = this.registerIdentity()

    setTimeout(() => {
      if (! this.checkIdentity(identityKey)) {
        return
      }

      this.isWaiting = false
      this.executor.run(...parameters)
    }, this.timeout)
  }
}