const test    = require('tape')
const sinon   = require('sinon')
const wraptor = require('../../wraptor')

const { id, noop }  = require('../helpers')

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
