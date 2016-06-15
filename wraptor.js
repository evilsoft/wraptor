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
    const subs = []
    const done = false

    function subscribe(o) {
      if(subs.indexOf(o) === -1) { subs.push(o) }

      if(!(o && typeof o.next === 'function')) {
        throw new TypeError('Invalid Observer Passed to subscribe')
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
      const y = fn(x)
      subs.forEach(s => s.next(y))
    }

    ObservableFunction[Symbol.observable] = () => {
      return { subscribe }
    }

    ObservableFunction.subscribe = subscribe

    return ObservableFunction
  }
}))
