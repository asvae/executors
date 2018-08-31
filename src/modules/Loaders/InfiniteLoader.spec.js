import InfiniteLoader from './InfiniteLoader'
import PointerRequestFactory from './PointerRequestFactory'
import AsyncHelpers from '../Helpers/AsyncHelpers'

describe('InfiniteLoader', () => {
  it('loads list', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      infiniteLoader.next()
      await AsyncHelpers.sleep(110)
      infiniteLoader.next()
      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.items.length).toBe(20)
      done()
    }
    asyncExpression()
  })

  it('refreshes', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      infiniteLoader.next()
      await AsyncHelpers.sleep(110)
      infiniteLoader.next()
      await AsyncHelpers.sleep(110)
      infiniteLoader.refresh()
      expect(infiniteLoader.items.length).toBe(20)
      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.items.length).toBe(10)
      done()
    }
    asyncExpression()
  })

  it('handles multiple next', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      infiniteLoader.next() // Should trigger first request
      await AsyncHelpers.sleep(90)
      infiniteLoader.next() // Should register second request
      await AsyncHelpers.sleep(20)
      infiniteLoader.next() // Should trigger second request
      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.items.length).toBe(20)
      expect(infiniteLoader.items[19]).toBe(19)
      done()
    }
    asyncExpression()
  })

  it('handles multiple refreshes', (done) => {
    let counter = 0
    const pointerRequest = (pointer, perStep) => {
      return new Promise((resolve) => {
        counter++
        setTimeout(() => {
          resolve([])
        }, 100)
      })
    }
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      infiniteLoader.refresh() // Should run request
      expect(counter).toBe(1)
      infiniteLoader.refresh() // Should do nothing
      expect(counter).toBe(1)
      infiniteLoader.refresh() // Should be run after the first one is finished
      await AsyncHelpers.sleep(120)
      expect(counter).toBe(2)
      done()
    }
    asyncExpression()
  })

  it('isRefreshing', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      // expect(infiniteLoader.isRefreshing).toBe(false)
      infiniteLoader.next()
      expect(infiniteLoader.isRefreshing).toBe(true)

      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.isRefreshing).toBe(false)

      infiniteLoader.next()
      expect(infiniteLoader.isRefreshing).toBe(false)

      infiniteLoader.refresh()
      // Previous request still running.
      expect(infiniteLoader.isRefreshing).toBe(false)

      // Refresh got its turn.
      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.isRefreshing).toBe(true)

      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.isRefreshing).toBe(false)
      done()
    }
    asyncExpression()
  })

  it('isProvidingCorrectPointerOnConcurrentRefresh', (done) => {
    const pointerRequest = PointerRequestFactory.getPointerRequest(100)
    const infiniteLoader = new InfiniteLoader(pointerRequest, 10)

    const asyncExpression = async () => {
      infiniteLoader.next()
      await AsyncHelpers.sleep(110)

      infiniteLoader.refresh()
      await AsyncHelpers.sleep(10)
      infiniteLoader.refresh()
      await AsyncHelpers.sleep(200)

      infiniteLoader.next()
      await AsyncHelpers.sleep(110)
      expect(infiniteLoader.items[infiniteLoader.items.length -1]).toBe(19)

      done()
    }
    asyncExpression()
  })
})
