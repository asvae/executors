import CacheExecutor from './CacheExecutor'

export default class CacheExecutorFactory {
  static getTimedExecutor (next = () => {}, time = 100): CacheExecutor {
    return new CacheExecutor(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(next())
        }, time)
      })
    })
  }
}
