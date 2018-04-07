import Executor from './Executor'
import AsyncHelpers from '../Helpers/AsyncHelpers'

export default class ExecutorFactory {
  static getTimedExecutor (next = () => {}, time = 100): Executor {
    return new Executor(async () => {
      await AsyncHelpers.sleep(time)
      return next()
    })
  }
}
