(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root['wraptor'] = factory()
  }
}(this, function() {
  return function wraptor(fn) {
    if(!(fn && typeof fn === 'function')) {
      throw new TypeError('Must provide a function to wrap')
    }

    const safeFn  = fn.bind(null)
    const subs    = []
    const done    = false

    function subscribe(o) {
      if(!(o && typeof o.next === 'function')) {
        throw new TypeError('Invalid Observer passed to subscribe')
      }

      if(subs.indexOf(o) === -1) {
        subs.push(o)
      }

      return {
        closed: () => done,
        unsubscribe() {
          const idx = subs.indexOf(o)
          if(idx !== -1) { subs.splice(idx, 1) }
        }
      }
    }

    function ObservableFunction(x) {
      const _val = safeFn(x)
      subs.forEach(s => s.next(_val))
    }

    ObservableFunction[Symbol.observable] = () => {
      return { subscribe }
    }

    ObservableFunction.subscribe = subscribe

    return ObservableFunction
  }
}))
