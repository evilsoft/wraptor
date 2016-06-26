(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root['wraptor'] = factory()
  }
}(this, function() {
  const slice = Array.prototype.slice

  function isFunction(fn) {
    return (fn && typeof fn === 'function')
  }

  function notifyNext(x, o) { o.next(x) }

  function notifyError(err, o) {
    if(isFunction(o.error)) {
      o.error(err)
    } else {
      throw err
    }
  }

  function partial(fn, args) {
    return Function.bind.apply(fn, [null].concat(args))
  }

  function applyCurry(fn, arg) {
    if(!isFunction(fn)) { return fn }
    return fn.length > 1 ? fn.bind(null, arg) : fn.call(null, arg)
  }

  // Main entry point for the lib.
  return function wraptor(fn) {
    // We need a function for this to work.
    if(!(isFunction(fn))) {
      throw new TypeError('Must provide a function to wrap')
    }
    // remove any binding and only access function once
    const safeFn = fn.bind(null)

    // cache number of arguments for partial detection
    const argsLength  = safeFn.length

    // partially apply ObserverFunction for returning partials
    const partialFunc = partial.bind(null, ObservableFunction)

    // cached list of subscribers
    const subs  = []

    function subscribe(o) {
      // Bare min is a next function on the provided Observer
      if(!(o && isFunction(o.next))) {
        throw new TypeError('Invalid Observer passed to subscribe')
      }

      // Add the Observer to the list of subscribers
      if(subs.indexOf(o) === -1) { subs.push(o) }

      // Return a Subcription object
      return {
        closed() { return false },
        unsubscribe()  {
          const idx = subs.indexOf(o)
          if(idx !== -1) { subs.splice(idx, 1) }
        }
      }
    }

    function ObservableFunction() {
      // arraylike args to Array
      const args = slice.call(arguments)

      // check for partial application
      // return a partially applied Observer Function
      if(args.length < argsLength) {
        return partialFunc(args)
      }

      try {
        const _val = (args.length === argsLength)
          ? safeFn.apply(null, args)          // Fully applied, run function
          : args.reduce(applyCurry, safeFn)   // Possible curry, fold arguments

        // If we need more arguments, return partial ObserverFunction
        if(isFunction(_val)) { return partialFunc(args) }

        // Notify all subscribers with result, only if we are fully applied
        subs.forEach(notifyNext.bind(null, _val))

        // return the final value for fully applied function
        return _val
      } catch(e) {
        // Notify subscribers on error channel,
        // or rethrow if we do not have anyone listening
        if(subs.length) {
          subs.forEach(notifyError.bind(null, e))
        } else { throw err }
      }
    }

    // Provide subscribe interface on Symbol.observable
    ObservableFunction[Symbol.observable] = () => ({ subscribe })

    // Provide subscribe method on function
    ObservableFunction.subscribe = subscribe

    return ObservableFunction
  }
}))
