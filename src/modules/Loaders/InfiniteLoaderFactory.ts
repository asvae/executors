import PointerRequestFactory from './PointerRequestFactory'
import InfiniteLoader from './InfiniteLoader'

export class InfiniteLoaderFactory {
  /**
   * Infinite loader generating a list of numbers by tens
   */
  static createNumberedList (): InfiniteLoader {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    return new InfiniteLoader(pointerRequest, 10)
  }
}