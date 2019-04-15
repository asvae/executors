import DebounceLoader from './DebounceLoader'
import AsyncHelpers from '../Helpers/AsyncHelpers'

describe('DebounceLoader', () => {
  it('offsets command execution time', done => {
    let count = 0
    const debounceLoader = new DebounceLoader(async () => count++, 100)

    const asyncExpression = async () => {
      debounceLoader.run()
      await AsyncHelpers.sleep(90)
      debounceLoader.run()
      await AsyncHelpers.sleep(90)
      expect(count).toBe(0)
      await AsyncHelpers.sleep(20)
      expect(count).toBe(1)
      done()
    }
    asyncExpression()
  })

  it('isWaiting', done => {
    const debounceLoader = new DebounceLoader(async () => {
    }, 100)

    const asyncExpression = async () => {
      expect(debounceLoader.isWaiting).toBe(false)
      debounceLoader.run()
      expect(debounceLoader.isWaiting).toBe(true)
      await AsyncHelpers.sleep(110)
      expect(debounceLoader.isWaiting).toBe(false)
      done()
    }
    asyncExpression()
  })

  it('isRunning', done => {
    const debounceLoader = new DebounceLoader(
      async () => await AsyncHelpers.sleep(100),
      100,
    )

    const asyncExpression = async () => {
      expect(debounceLoader.isRunning).toBe(false)
      debounceLoader.run()
      expect(debounceLoader.isRunning).toBe(false)
      await AsyncHelpers.sleep(110)
      expect(debounceLoader.isRunning).toBe(true)
      await AsyncHelpers.sleep(110)
      expect(debounceLoader.isRunning).toBe(false)
      done()
    }
    asyncExpression()
  })

  it('reset', done => {
    const expression = async () => {
      throw new Error('This expression should not be executed')
    }
    const debounceLoader = new DebounceLoader(expression, 100)

    const asyncExpression = async () => {
      debounceLoader.run()
      await AsyncHelpers.sleep(50)
      debounceLoader.reset()
      await AsyncHelpers.sleep(100)
      done()
    }
    asyncExpression()
  })
})
