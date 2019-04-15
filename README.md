# asva-executors

Helper classes for your async flow control.

## Install

* **npm**: `npm install asva-executors` 
* **yarn**: `yarn add asva-executors`

## Intent

Conceptually, executors are just wrappers for asynchronous commands (functions). Yet they possess the following benefits:

* They encapsulate the command, allowing it to be safely passed around without exposing its internals.
* Provide utility methods for state monitoring. For instance, `executor.isRunning` tells whether executor runs command or not. Vanilla JS solutions often involve flags and are much clunkier.
* Enforce specific logic for command execution. You can cache results, limit concurrent runs or even encapsulate into executor the logic for your lazy loaded list.

Executors are low-level concept and might require a bit of time to wrap your head around. After that they're intuitive and fun to use.

This library was not born on the spot and classes were used in various applications big and small by multiple developers for more than a year. Expect it to be reasonably refined and well thought.

Library is armed with TypeScript declarations and tests.

## Classes

Available classes are:

* **Executor** - basic executor (is extended by all other executors).
* **CacheExecutor** - caches first result.
* **LadderExecutor** - runs subsequent request only after previous one is finished.
* **StatefulExecutor** - stores loaded result.
* **RetrierExecutor** - checks condition on interval.
* **DebounceLoader** - provides [debounce][debounce-article] functionality.
* **RepeatLoader** - `setInterval` wrapped in class.
* **InfiniteLoader** - encapsulates lazy loaded list logic.

Here are some possible use cases:

* **Executor** - loaders (spinners), passing control through nested component structure.
* **CacheExecutor** - one time requests (languages, configs, currencies), deep nested data aggregation.
* **LadderExecutor** - fast live search.
* **StatefulExecutor** - sugar for standard executor cases with single state.
* **RetrierExecutor** - tests.
* **DebounceLoader** - auto-saving, slow live search.
* **RepeatLoader** - timed operations, websocket simulation and other hacks.
* **InfiniteLoader** - lazy loaded list.

You may have noticed that we have `Executor` classes and `Loader` classes.  

**Executor**'s constructor takes in a function that returns promise, and, as a result provides better async flow control.
```javascript
const executor = new Executor(functionThatReturnsPromise)
await executor.run()
await executor.run()
```

**Loader**'s constructor requires specific arguments, different for each case. `run` function won't return Promise. Asyncronous handling is loader internal.
```javascript
const loader = new Loader(genericFunction)
loader.run()
```

## Code and examples

### Executor

```javascript
import { Executor } from 'asva-executors'

// This command is just example. Yours should still return promise but hopefully be more useful : 3.
const command = response => Promise.resolve(response)

// Instantiate executor
const executor = new Executor(command)

// Run command and process results
executor.run('data').then(result => console.log(result)) // Outputs 'data' to console

// Instantiate executor and run immediately
const executor = Executor.createAndRun(command)

// Do some checks
executor.isRunning // Tells if executor currently runs command.
executor.runCount  // Show the number of currently running commands. There could be more than one, yes.
executor.wasRun // Executor was run at least once
executor.wasRunFine // Executor was run without throwing error at least once
executor.wasRunBad // Executor was run with thrown error at least once
executor.wasLastRunFine // Last executor run happened without an error
``` 

### CacheExecutor

```javascript
// We intend to make an expensive ajax call from several places.
import { CacheExecutor } from 'asva-executors'
const executor = new CacheExecutor(ajaxExpensiveCall)

// Run the same executor in a number of places simultaneously or not. 
// Command will be executed only once.
const result = await executor.run()

// If you have to load anew.
executor.runFresh()
``` 

### LadderExecutor

```javascript
// This example is live search.
import { LadderExecutor } from 'asva-executors'
const executor = new Executor(liveSearchCall)

// Imagine the case when user takes a nap on his keyboard.
executor.run('a') // This request will be run
executor.run('aa') // This request won't be run
executor.run('aaa') // This request won't be run
executor.run('aaaa') // This request will be run only after first one resolves.
// So, in total you have 2 requests instead of 4.
``` 

### StatefulExecutor

```javascript
// Example is simple select that manages its own state.
import { StatefulExecutor } from 'asva-executors'
const executor = new StatefulExecutor(command, []) // if you don't provide second argument, default state is `null`

executor.state // will be initially []
await executor.run()
executor.state // Now becomes whatever was returned from `command`.
``` 

### RetrierExecutor

```javascript
// In test environment we want to observe data or DOM change when we don't have any event handle.
import { RetrierExecutor } from 'asva-executors'
// We will check observed property every 10ms for 1000ms at max.
const retrierExecutor = new RetrierExecutor(() => property === expectedValue, 10, 1000)

// `run` returns normal promise
await retrierExecutor.run()
``` 

If 1000ms passes and condition is not yet fullfilled - promise will reject.`

### DebounceLoader

```javascript
// We want to save the form if user was inactive for 3 seconds.
import { DebounceLoader } from 'asva-executors'
const loader = new DebounceLoader(saveTheForm, 3000)

// User starts editing the form
loader.run()
// And does that a couple of times in quick succession.
loader.run()
loader.run()
// Then he stops. 3 seconds pass. And only then `saveTheForm` command is called.

// User starts editing the form again.
loader.run()
// Then goes to another page. We want to stop execution.
loader.reset()
``` 

DebounceLoader has several public properties:
```javascript
loader.isRunning // Means command is currently executing.
loader.isWaiting // Executor is waiting the period of inactivity to finish.
loader.isActive // Executor is running or is waiting. 
```

### RepeatLoader

```javascript
// Being too lazy to implement websockets we decide to check notifications every ten seconds.
import { RepeatLoader } from 'asva-executors'
const loader = new RepeatLoader(checkNotificationsCall, 10000)

// Start checking notifications
loader.start()

// Stop checking notifications
loader.stop()
``` 

You have to stop `RepeatLoader` if you don't need it anymore. Similar to `setInterval` command it won't be garbage collected until then.

### InfiniteLoader

```javascript
// This example is lazy loaded list of items.
import { InfiniteLoader } from 'asva-executors'

/**
* Constructor takes in two arguments:
* 
* * command, which is a function that takes in 
*   - `pointer` (position in list, OFFSET in sql),
*   - `perStep` (number of items per request, LIMIT in sql);
*   and returns promise with a specified number of items.
*   If length of items loaded is less than `perStep`, loader
*   would consider itself finished and won't trigger anymore. 
*   
* * perStep - number of items per request (defaults to 20)
*/
const loader = new InfiniteLoader(
  async (pointer, perStep) =>  await loadListItems(pointer, perStep), 
  10
)
// User opens the page.
loader.next() // Loader begins to load first 10 items.
// User scrolls down impatiently.
loader.next() // This command will be ignored silently as first request is still in progress.
// User waits for list to be downloaded.
console.log(loader.items.length) // > 10
// User read through first 10 items and he wants more.
loader.next() // Loads next 10 items
// And they're swiftly loaded.
console.log(loader.items.length) // > 20
// User decides to apply a filter because scrolling is hard.
loader.refresh() // Starts request to load items anew. Old items are left intact until request finishes.
// List is refreshed with new filter.
console.log(loader.items.length) // > 10

// To access your items call.
loader.items

// You can perform various checks on `InfiniteLoader` instance:
loader.isRunning // Loader is running
loader.isEmpty // We tried to load, but list is empty
loader.ifFull // We tried to load, and list is not empty
loader.isRefreshing // Is loading anew (refreshing or loading for first time).
```

-----------------------

Feel free to check [source code][source-code-link] or tests to get better understanding. Library exposes typings so your IDE should comfortably provide type-hinting. 

## Fun facts

* Name "executor" was taken from [Java][java-executor-url] and is quite similar conceptually.

## Issues

* Bugs will be addressed in timely manner.
* More-less library is *done*. But feel free to share your idea of improvement.

## Licence
MIT

[java-executor-url]: https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Executor.html
[debounce-article]: https://css-tricks.com/debouncing-throttling-explained-examples/
[source-code-link]: src/modules
