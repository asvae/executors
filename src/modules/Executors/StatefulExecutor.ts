import Executor, { ExecutorCommand } from './Executor'

/**
 * This executor keeps state of last result
 */
export class StatefulExecutor extends Executor {
  public state: any

  public constructor (command: ExecutorCommand, state: any = null) {
    super(command)
    this.state = state
  }

  static createAndRun (command: ExecutorCommand, state: any = null): StatefulExecutor {
    const executor = new StatefulExecutor(command, state)
    executor.run()
    return executor
  }

  /**
   * Run command and cache promise.
   */
  public run (...parameters: any[]): Promise<any> {
    const promise = super.run(...parameters)
    promise.then(result => {
      this.state = result
    })
    return promise
  }
}
