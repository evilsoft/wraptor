const test    = require('tape')
const wraptor = require('../../wraptor')

const { noop, validObserver } = require('../helpers')

const func = wraptor(noop)

test('subscription provides a closed method', t => {
  const { closed } = func.subscribe(validObserver())

  t.equal(typeof closed, 'function', 'is a function')
  t.end()
})

test('closed method returns false', t => {
  const { closed } = func.subscribe(validObserver())

  t.equal(closed(), false, 'result is false')
  t.end()
})

test('subscription provides an unsubscribe method', t => {
  const { unsubscribe } = func.subscribe(validObserver())

  t.equal(typeof unsubscribe, 'function', 'is a function')
  t.end()
})

test('unsubscribe returns undefined', t => {
  const { unsubscribe } = func.subscribe(validObserver())

  t.equal(unsubscribe(), undefined, 'result is undefined')
  t.end()
})
