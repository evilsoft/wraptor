# wraptor
The Observable function wrapper your granddad wish he had.

`wraptor` takes any n-ary, unbound, pure function and provides you with a new function that implements the Observable instance interface as proposed by [ECMAScript Observable](https://github.com/zenparsing/es-observable).
The resulting function can then notify any subscribers of the function's results when the function is called.

`wraptor` allows you make any n-ary, unbound, pure function a source for many RFP stream libraries that implement against the proposal. ([mostjs](https://github.com/cujojs/most) and [rxjs5](https://github.com/ReactiveX/rxjs) for example, just use their `from` methods).

## Installing
_**IMPORTANT**:_ As the proposal is in [Stage 1](https://github.com/tc39/proposals) right now, this library will only target modern to future JavaScript environments.
What that means is that it will only run in node 4.x or greater and only the latest popular browsers excluding IE. This of course could change based on community response and needs.

`wraptor` is provided as an npm package and can be installed by running the following in your project folder:

```
$ npm install wraptor -S
```

It is _never_ recommended to install `wraptor` as a global package.

## Usage

### Basic

While `wraptor` is intended to act as a stream source for RFP libraries, there is nothing stopping you from using it directly. Just wrap a function, subscribe to it and you are off to the races.

```javascript
// bring in wraptor:
// Function f => f -> ObserverFunction f
const wraptor = require('wraptor')

// wrap your handy dandy function.
const add2 = wraptor(x => x + 2)

// subscribe to the function and cache a subscription object
// if you wanna. Use it to unsubscribe
const sub = add2.subscribe({
  next:   console.log.bind(console, 'next:'),
  error:  console.log.bind(console, 'error:')
})

// call the function, logging the return value.
// the subscription will receive notification of the
// result before the function returns
console.log('result:', add2(3))

// logs:
// next: 5
// result: 5

// use the subscription object to unsubscribe.
sub.unsubscribe()

// call the function, logging the return value.
// the old subscription will no longer receive
// notification of the result
console.log('2nd result:', add2(26))

// logs:
// 2nd result: 28
```

### Auto-Curry (Paritaling)
`wraptor` provides automatic curry that will allow you to partially apply any function. No need to use a separate curry function for functions you intend to use with `wraptor`. The neat bit about this, is that subscribers will only be notified when a given function is fully applied.

```javascript
const wraptor = require('wraptor')

// wrap your n-ary function.
const add = wraptor((x, y) => x + y)

// subscribe to the function
add.subscribe({
  next:   console.log.bind(console, 'next:'),
  error:  console.log.bind(console, 'error:')
})

// use partial application to create an new function,
// still hooked up to the subscribers of the original
// function. Subscribers are not notified until a
// fully applied function is invoked
const add10 = add(10)

// subscribers are NOT notified

// invoke the function, fully applying it and
// logging the return value.
console.log('result:', add10(13))

// logs:
// next: 23
// result: 23

// or just fully apply it...it will just work
console.log('result:', add(13, 22))

// logs:
// next: 35
// result: 35

// or this lil gem of course
console.log('result:', add(-5)(15))

// logs:
// next: 10
// result: 10
```

### Providing Pre-Curried Functions
Just because you can use `wraptor` for your partial interface, does not mean you cannot provide a function with your own. No matter the shape, as long as each function returned takes at least one argument (no thunks right now :cry:) then `wraptor` will normalize it for you.

```javascript
const wraptor = require('wraptor')

// wrap your pure curried function.
const add3 = wraptor(x => y => z => x + y + z)

// or some higher order chap with context groupings
const addKey = wraptor(
  (key, val) => x => Object.assign({}, {[key]: val}, x)
)

// just some data for plays
const data = { sadness: false }

// No matter the interface of your original function,
// wraptor will normalize it for you.
console.log('fully apply add3:', add3(10, 10, 10));
console.log('fully apply addKey:', addKey('tickles', true, data));

// logs:
// fully apply add3: 30
// fully apply addKey: { tickles: true, sadness: false }

console.log('curry add3:', add3(1)(2)(3));
console.log('curry addKey:', addKey('blue')(42)({}));

// logs:
// curry add3: 6
// curry addKey: { blue: 42 }

// heck, you can call them however you desire
console.log('whateves add3:', add3(10, 2)(32));
console.log('whateves addKey:', addKey('green')('spleen', {}));

// logs:
// whateves add3: 44
// whateves addKey: { green: 'spleen' }
```

### Using with fancy FP libraries
`wraptor` works very well with many of the functional libs out there for all you declarative types. Give it a spin with libs like [ramda](http://ramdajs.com/0.21.0/index.html) or [lodash-fp](https://github.com/lodash/lodash/wiki/FP-Guide).

```javascript
// compose, objOf, omit and prop come from your totes favs
// FP lib.
const wraptor = require('wraptor')

// wrap a dispatch function that removes any key named junk
// and adds the result to an object keyed by the action
const dispatch = wraptor(
  action => compose(objOf(action), omit('junk'))
)

// just some mess around
const data = { junk: 'omit me please', result: 42 }

// create a special dispatch function just for sendData action
const sendData = compose(prop('sendData'), dispatch('sendData'))

// your reducer or app state updater can pick up on dispatches
// through a subscription. (think the scan function on a stream lib)
// Here we just logIt.
dispatch.subscribe({
  next:   console.log.bind(console, 'next:'),
  error:  console.log.bind(console, 'error:')
})

// once called, the data is dispatched and the function
// returns its value ready to be in any other composition.
console.log('func returned:', sendData(data));

// logs:
// next: { sendData: { result: 42 }
// func returned: { result: 42 }
```
