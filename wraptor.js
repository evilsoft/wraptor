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

  return function wraptor(fn) {
    if(!(isFunction(fn))) {
      throw new TypeError('Must provide a function to wrap')
    }

    const safeFn      = fn.bind(null)
    const argsLength  = safeFn.length
    const partialFunc = partial.bind(null, ObservableFunction)

    const subs    = []
    const done    = false

    function subscribe(o) {
      if(!(o && isFunction(o.next))) {
        throw new TypeError('Invalid Observer passed to subscribe')
      }

      if(subs.indexOf(o) === -1) { subs.push(o) }

      return {
        closed: () => done,
        unsubscribe()  {
          const idx = subs.indexOf(o)
          if(idx !== -1) { subs.splice(idx, 1) }
        }
      }
    }

    function ObservableFunction() {
      const args = slice.call(arguments)

      if(args.length < argsLength) {
        return partialFunc(args)
      }

      try {
        const _val = safeFn.apply(null, args)

        if(isFunction(_val)) {
          return partialFunc(args)
        }

        subs.forEach(notifyNext.bind(null, _val))

        return _val
      } catch(e) {
        subs.forEach(notifyError.bind(null, e))
      }
    }

    ObservableFunction[Symbol.observable] = () => {
      return { subscribe }
    }

    ObservableFunction.subscribe = subscribe

    return ObservableFunction
  }
}))
