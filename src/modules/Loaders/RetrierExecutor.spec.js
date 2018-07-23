import RetrierExecutor from './RetrierExecutor'
import AsyncHelpers from '../Helpers/AsyncHelpers'

describe('RetrierExecutor', () => {
  fit('loads list', (done) => {
    const asyncExpression = async () => {
      let valueToCheck = false

      ;(async () => {
        await AsyncHelpers.sleep(500)
        valueToCheck = true
      })()

      const retrierExecutor = new RetrierExecutor(
        () => valueToCheck,
        200,
      )

      await retrierExecutor.run()
      expect(retrierExecutor.timeElapsed).toBe(600)
      done()
    }
    asyncExpression()
  })

  fit('throws when max timeout is exceeded', (done) => {
    const asyncExpression = async () => {
      const retrierExecutor = new RetrierExecutor(() => false, 100, 1000)
      try {
        await retrierExecutor.run()
      } catch (e) {
        expect(retrierExecutor.timeElapsed).toBe(1100)
        done()
      }
    }
    asyncExpression()
  })
})
