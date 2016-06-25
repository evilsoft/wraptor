const test    = require('tape')
const sinon   = require('sinon')
const wraptor = require('../../wraptor')
const helpers = require('../helpers')

const id   = helpers.id
const noop = helpers.noop

test('subscribed Observers are notified with result', t => {
  const func    = wraptor(id)
  const result  = 'some Input'

  const first  = {
    next(x) {
      t.equal(x, result, 'first notified with result')
    }
  }

  const second = {
    next(x) {
      t.equal(x, result, 'second notified with result')
    }
  }

  t.plan(2)

  func.subscribe(first)
  func.subscribe(second)

  func(result)
})

test('unsubscribed observers do not receive notifications', t => {
  const func          = wraptor(noop)
  const observer      = { next: sinon.spy() }
  const subscription  = func.subscribe(observer)

  func()
  subscription.unsubscribe()
  func()

  t.equal(observer.next.callCount, 1, 'observer only called once')
  t.end()
})

test('calls error when wrapped function throws', t => {
  function throws() { throw new Error() }
  const func          = wraptor(throws)
  const observer      = { error: sinon.spy(), next: noop }

  func.subscribe(observer)

  t.doesNotThrow(func)
  t.equal(observer.error.called, true)
  t.end()
})

test('rethrows error when error fn not provided', t => {
  function throws() { throw new Error() }
  const func          = wraptor(throws)
  const observer      = { next: noop }

  func.subscribe(observer)

  t.throws(func, Error)
  t.end()
})
