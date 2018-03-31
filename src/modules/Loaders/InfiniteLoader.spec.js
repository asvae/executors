import InfiniteLoader from './InfiniteLoader'
import PointerRequestFactory from './PointerRequestFactory'

describe('InfiniteLoader', () => {
  fit('loads list', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest()
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      await infiniteLoader.next()
      await infiniteLoader.next()
      expect(infiniteLoader.items.length).toBe(20)
      done()
    }
    asyncExpression()
  })
  it('refreshes', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest()
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      await infiniteLoader.next()
      await infiniteLoader.next()
      const refreshRequest = infiniteLoader.refresh()
      expect(infiniteLoader.items.length).toBe(20)
      await refreshRequest
      expect(infiniteLoader.items.length).toBe(10)
      done()
    }
    asyncExpression()
  })
})
