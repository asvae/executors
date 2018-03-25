import LadderExecutor from './LadderExecutor.ts'
import LadderExecutorFactory from './LadderExecutorFactory'

describe('LadderExecutor', () => {
  it('runs as expected', (done) => {
    let runCount = 0
    const executor = new LadderExecutorFactory.getTimedExecutor(() => ++runCount)

    // We express intent to run executor three times
    const one = executor.run() // Triggered immediately
      .then(result => {
        expect(result).toBe(1)
      })

    executor.run() // Queued. This will return endless promise.

    const three = executor.run() // Replaces `two` in queue.
      .then(result => {
        expect(result).toBe(2)
      })

    Promise.all([one, three]).then(() => done())
  })
})
