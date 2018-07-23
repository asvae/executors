import RetrierExecutor from './RetrierExecutor'
import AsyncHelpers from '../Helpers/AsyncHelpers'

describe('RetrierExecutor', () => {
  it('works in default conditions', (done) => {
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

  it('throws when max timeout is exceeded', (done) => {
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

  it('waitUntil', (done) => {
    const asyncExpression = async () => {
      let valueToCheck = false

      AsyncHelpers.sleep(500)
        .then(() => {
          valueToCheck = true
        })

      await RetrierExecutor.waitUntil(() => valueToCheck, 200, 2000)
      done()
    }
    asyncExpression()
  })
})
