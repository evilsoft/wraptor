const test    = require('tape')
const wraptor = require('../../wraptor')
const helpers = require('../helpers')

const noop          = helpers.noop
const validObserver = helpers.validObserver

const func = wraptor(noop)

test('subscription provides a closed method', t => {
  const closed = func.subscribe(validObserver()).closed

  t.equal(typeof closed, 'function', 'is a function')
  t.end()
})

test('closed method returns false', t => {
  const closed = func.subscribe(validObserver()).closed

  t.equal(closed(), false, 'result is false')
  t.end()
})

test('subscription provides an unsubscribe method', t => {
  const unsubscribe = func.subscribe(validObserver()).unsubscribe

  t.equal(typeof unsubscribe, 'function', 'is a function')
  t.end()
})

test('unsubscribe returns undefined', t => {
  const unsubscribe = func.subscribe(validObserver()).unsubscribe

  t.equal(unsubscribe(), undefined, 'result is undefined')
  t.end()
})
