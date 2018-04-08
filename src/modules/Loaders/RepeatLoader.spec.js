import RepeatLoader from './RepeatLoader'

describe('RepeatLoader', () => {
  it('simple closure', (done) => {
    let count = 0
    const repeatExecutor = new RepeatLoader(() => count++, 100)
    repeatExecutor.start()
    setTimeout(() => {
      repeatExecutor.stop()
      expect(count).toBe(2)
      done()
    }, 250)
  })
})
