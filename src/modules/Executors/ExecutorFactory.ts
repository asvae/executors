import Executor from './Executor'

export default class ExecutorFactory {
  static getTimedExecutor (next = () => {}, time = 100): Executor {
    return new Executor(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(next())
        }, time)
      })
    })
  }
}
