import Executor from './Executor'
import LadderExecutor from './LadderExecutor'

export default class LadderExecutorFactory {
  static getTimedExecutor (next = () => {}, time = 100): LadderExecutor {
    return new LadderExecutor(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(next())
        }, time)
      })
    })
  }
}
