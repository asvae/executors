import RepeatExecutor from './RepeatExecutor'

describe('RepeatExecutor', () => {
  it('simple closure', (done) => {
    let count = 0
    const repeatExecutor = new RepeatExecutor(() => count++, 100)
    repeatExecutor.start()
    setTimeout(() => {
      repeatExecutor.stop()
      expect(count).toBe(2)
      done()
    }, 250)
  })
})
