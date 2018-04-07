import CacheExecutorFactory from './CacheExecutorFactory'
import CacheExecutor from './CacheExecutor'

describe('CacheExecutor', () => {
  it('caches command result', done => {
    let runCount = 0

    // Executor takes in the `state` scope and is able to change `state` asynchronously.
    const executor = CacheExecutorFactory.getTimedExecutor(() => {
      runCount++
    }, 100)

    const asyncExpression = async () => {
      await executor.run()
      await executor.run()
      expect(runCount).toBe(1)
      done()
    }
    asyncExpression()
  })

  it('runFresh', done => {
    let runCount = 0

    // Executor takes in the `state` scope and is able to change `state` asynchronously.
    const executor = CacheExecutorFactory.getTimedExecutor(() => {
      runCount++
    }, 100)

    const asyncExpression = async () => {
      await executor.run()
      expect(runCount).toBe(1)
      await executor.runFresh()
      expect(runCount).toBe(2)
      done()
    }
    asyncExpression()
  })
})
