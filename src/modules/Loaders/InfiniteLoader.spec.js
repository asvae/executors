import InfiniteLoader from './InfiniteLoader'
import PointerRequestFactory from './PointerRequestFactory'

describe('InfiniteLoader', () => {
  it('loads list', (done) => {
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
  fit('handles multiple calls', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest()
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      // We try to perform 3 calls
      const one = infiniteLoader.next()
      infiniteLoader.next()
      const three = infiniteLoader.next()
      await Promise.all([one, three])
      // But only 2 should happen
      console.log('infiniteLoader.items', infiniteLoader.items)
      expect(infiniteLoader.items.length).toBe(20)
      expect(infiniteLoader.items[19]).toBe(19)
      done()
    }
    asyncExpression()
  })
})
