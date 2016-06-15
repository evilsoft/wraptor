const test    = require('tape')
const wraptor = require('./wraptor')

test('Smoke Test', t => {
  t.equal(typeof wraptor, 'function')
  t.end()
})
