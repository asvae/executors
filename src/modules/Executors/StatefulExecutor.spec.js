import { StatefulExecutor } from './StatefulExecutor'

fdescribe('StatefulExecutor', () => {
  it('executes with state', done => {
    const listLoadingStatefulExecutor = new StatefulExecutor(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([1, 2, 3])
        }, 100)
      })
    }, [])

    const asyncExpression = async () => {
      expect(listLoadingStatefulExecutor.state).toEqual([])
      await listLoadingStatefulExecutor.run()
      expect(listLoadingStatefulExecutor.state).toEqual([1, 2, 3])
      done()
    }
    asyncExpression()
  })

  it('create and run', done => {
    const listLoadingStatefulExecutor = StatefulExecutor.createAndRun(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([1, 2, 3])
        }, 100)
      })
    })
    setTimeout(() => {
      expect(listLoadingStatefulExecutor.state).toEqual([1, 2, 3])
      done()
    }, 120)
  })
})
