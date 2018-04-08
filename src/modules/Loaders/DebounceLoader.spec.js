import DebounceLoader from './DebounceLoader'
import AsyncHelpers from '../Helpers/AsyncHelpers'

describe('DebounceLoader', () => {
  it('offsets command execution time', done => {
    let count = 0
    const debounceExecutor = new DebounceLoader(async () => count++, 100)

    const asyncExpression = async () => {
      debounceExecutor.run()
      await AsyncHelpers.sleep(90)
      debounceExecutor.run()
      await AsyncHelpers.sleep(90)
      expect(count).toBe(0)
      await AsyncHelpers.sleep(20)
      expect(count).toBe(1)
      done()
    }
    asyncExpression()
  })

  it('isWaiting', done => {
    const debounceExecutor = new DebounceLoader(async () => {}, 100)

    const asyncExpression = async () => {
      expect(debounceExecutor.isWaiting).toBe(false)
      debounceExecutor.run()
      expect(debounceExecutor.isWaiting).toBe(true)
      await AsyncHelpers.sleep(110)
      expect(debounceExecutor.isWaiting).toBe(false)
      done()
    }
    asyncExpression()
  })

  it('isRunning', done => {
    const debounceExecutor = new DebounceLoader(
      async () => await AsyncHelpers.sleep(100),
      100,
    )

    const asyncExpression = async () => {
      expect(debounceExecutor.isRunning).toBe(false)
      debounceExecutor.run()
      expect(debounceExecutor.isRunning).toBe(false)
      await AsyncHelpers.sleep(110)
      expect(debounceExecutor.isRunning).toBe(true)
      await AsyncHelpers.sleep(110)
      expect(debounceExecutor.isRunning).toBe(false)
      done()
    }
    asyncExpression()
  })
})
