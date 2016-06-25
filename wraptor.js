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

  return function wraptor(fn) {
    if(!(isFunction(fn))) {
      throw new TypeError('Must provide a function to wrap')
    }

    const safeFn  = fn.bind(null)
    const subs    = []
    const done    = false

    function unsubscribe(o) {
      const idx = subs.indexOf(o)
      if(idx !== -1) { subs.splice(idx, 1) }
    }

    function subscribe(o) {
      if(!(o && isFunction(o.next))) {
        throw new TypeError('Invalid Observer passed to subscribe')
      }

      if(subs.indexOf(o) === -1) { subs.push(o) }

      return {
        closed,
        unsubscribe: unsubscribe.bind(null, o)
      }
    }

    function ObservableFunction() {
      if(subs.length) {
        const args = slice.call(arguments)

        try {
          const _val = safeFn.apply(null, args)
          subs.forEach(notifyNext.bind(null, _val))
        } catch(e) {
          subs.forEach(notifyError.bind(null, e))
        }
      }
    }

    ObservableFunction[Symbol.observable] = () => {
      return { subscribe }
    }

    ObservableFunction.subscribe = subscribe

    return ObservableFunction
  }
}))
