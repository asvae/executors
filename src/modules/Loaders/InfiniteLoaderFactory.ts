import PointerRequestFactory from './PointerRequestFactory'
import InfiniteLoader from './InfiniteLoader'

export class InfiniteLoaderFactory {
  /**
   * Infinite loader generating a list of numbers by tens
   */
  static createNumberedList (timeout: number = 300): InfiniteLoader {
    const pointerRequest = PointerRequestFactory.getPointerRequest(timeout)
    return new InfiniteLoader(pointerRequest, 10)
  }
}