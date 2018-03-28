import Executor from './Executor'

/**
 * This executor caches first result
 */
export default class CacheExecutor extends Executor {
  
  cachedPromise: Promise<any> | null = null

  /**
   * @public
   */
  run (...parameters: any[]): Promise<any> {
    if (!this.cachedPromise) {
      this.cachedPromise = super.run(...parameters)
    }
    return this.cachedPromise
  }

  runFresh (...parameters: any[]): Promise<any> {
    this.cachedPromise = super.run(...parameters)
    return this.cachedPromise
  }

  cleanCache () {
    this.cachedPromise = null
  }
}