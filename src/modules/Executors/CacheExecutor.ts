import Executor from './Executor'

/**
 * This executor caches first result
 */
export default class CacheExecutor extends Executor {
  
  cachedPromise: Promise<any> = null

  /**
   * @public
   */
  run (...parameters): Promise<any> {
    if (!this.cachedPromise) {
      this.cachedPromise = super.run(...parameters)
    }
    return this.cachedPromise
  }

  runFresh (...parameters): Promise<any> {
    this.cachedPromise = super.run(...parameters)
    return this.cachedPromise
  }

  cleanCache () {
    this.cachedPromise = null
  }
}