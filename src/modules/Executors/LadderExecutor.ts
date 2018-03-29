import Executor from './Executor'

/**
 * This executor will chain requests ladder-like.
 * Last one will always be executed.
 * For skipped requests the promise will never be resolved.
 */
export default class LadderExecutor extends Executor {
  private trigger: Function | null = null

  public run (...parameters: any[]): Promise<any>  {
    if (!this.isRunning) {
      const promise = super.run(...parameters)
      promise.then(() => {
        this.trigger && this.trigger()
        this.trigger = null
      })
      return promise
    }

    return new Promise((resolve) => {
      this.trigger = () => this.run(...parameters).then(resolve)
    })
  }
}
