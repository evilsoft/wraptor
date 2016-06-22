const test    = require('tape')
const wraptor = require('../../wraptor')

const { noop, bindFunc } = require('../helpers')

const w     = bindFunc(wraptor)
const func  = wraptor(noop)
const oSf   = func[Symbol.observable]

test('entry is a function', t => {
  t.equal(typeof wraptor, 'function', 'should be a function')
  t.end()
})

test('invalid input to entry throws TypeError', t => {
  t.throws(w(), TypeError, 'nothing')
  t.throws(w(undefined), TypeError, 'undefined')

  t.throws(w(null), TypeError, 'null')
  t.throws(w({}), TypeError, 'POJO')

  t.throws(w(0), TypeError, 'falsey number')
  t.throws(w(1), TypeError, 'truthy number')

  t.throws(w(''), TypeError, 'falsey string')
  t.throws(w('string'), TypeError, 'truthy string')

  t.throws(w(true), TypeError, 'truthy boolean')
  t.throws(w(false), TypeError, 'falsey boolean')

  t.end()
})

test('valid input to entry does not throw', t => {
  t.doesNotThrow(w(noop), 'does not throw with function')
  t.end()
})

test('entry provides a Symbol(observer) function', t => {
  t.equal(typeof oSf, 'function', 'is a function')
  t.end()
})

test('entry provides a subscribe function', t => {
  t.equal(typeof func.subscribe, 'function', 'is a function')
  t.end()
})

test('calling Symbol(observable) returns an object with the subscribe function', t => {
  const result = oSf()

  t.equal(typeof result, 'object', 'is an object')
  t.equal(typeof result.subscribe, 'function', 'has a subscribe function')
  t.equal(result.subscribe, func.subscribe, 'shares the entry subscribe function')

  t.end()
})
