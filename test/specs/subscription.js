const test    = require('tape')
const wraptor = require('../../wraptor')

const { noop, validObserver } = require('../helpers')

const o = wraptor(noop)

test('subscription provides a close method', t => {
  const { closed } = o.subscribe(validObserver())

  t.equal(typeof closed, 'function', 'is a function')
  t.end()
})

test('subscription provides an unsubscribe method', t => {
  const { unsubscribe } = o.subscribe(validObserver())

  t.equal(typeof unsubscribe, 'function', 'is a function')
  t.end()
})
