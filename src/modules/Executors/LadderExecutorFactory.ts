import LadderExecutor from './LadderExecutor'
import AsyncHelpers from '../Helpers/AsyncHelpers'

export default class LadderExecutorFactory {
  static getTimedExecutor (next = () => {}, time = 100): LadderExecutor {
    return new LadderExecutor(async () => {
      await AsyncHelpers.sleep(time)
      return next()
    })
  }
}
