const test    = require('tape')
const wraptor = require('../../wraptor')

const { noop, bindFunc, validObserver } = require('../helpers')

const s = bindFunc(wraptor(noop).subscribe)

test('invalid input to subscribe throws TypeError', t => {
  t.throws(s(), TypeError, 'nothing')

  t.throws(s(null), TypeError, 'null')
  t.throws(s(undefined), TypeError, 'undefined')

  t.throws(s(0), TypeError, 'falsey number')
  t.throws(s(1), TypeError, 'truthy number')

  t.throws(s(''), TypeError, 'falsey string')
  t.throws(s('string'), TypeError, 'truthy string')

  t.throws(s(false), TypeError, 'falsey boolean')
  t.throws(s(true), TypeError, 'truthy boolean')

  t.throws(s({}), TypeError, 'invalid Observer')
  t.end()
})

test('valid input to subscribe does not throw', t => {
  t.doesNotThrow(s(validObserver()), 'valid Observer')
  t.end()
})
