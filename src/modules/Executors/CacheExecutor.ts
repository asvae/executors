import Executor from './Executor'

/**
 * This executor caches first run result and provides it for all subsequent calls.
 */
export default class CacheExecutor extends Executor {
  protected cachedPromise: Promise<any> | null = null

  /**
   * Run command and cache promise.
   */
  public run (...parameters: any[]): Promise<any> {
    if (!this.cachedPromise) {
      this.cachedPromise = super.run(...parameters)
    }
    return this.cachedPromise
  }

  /**
   * Run executor without cache. Promise will be put to cache though.
   */
  public runFresh (...parameters: any[]): Promise<any> {
    this.cachedPromise = super.run(...parameters)
    return this.cachedPromise
  }

  /**
   * Just clean cache.
   */
  public cleanCache () {
    this.cachedPromise = null
  }
}