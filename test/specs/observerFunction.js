const test    = require('tape')
const wraptor = require('../../wraptor')
const helpers = require('../helpers')

test('observer function is auto-curried', t => {
  const func = wraptor((x, y) => x + y)

  t.equal(func(2, 2), 4, 'full application')
  t.equal(func(2)(2), 4, 'full application through parital application')

  t.end()
})

test('observer function accepts most curried functions', t => {
  const curried = wraptor(x => y => z => x + y + z)
  const crazy   = wraptor((x, y) => z => x + y + z)
  const crazier = wraptor(x => (y, z) => x + y + z)

  t.equal(curried(2, 2, 2), 6, 'curried full application')
  t.equal(curried(2, 2)(2), 6, 'curried 2 first')
  t.equal(curried(2)(2, 2), 6, 'curried 1 first')
  t.equal(curried(2)(2)(2), 6, 'curried fully curried')

  t.equal(crazy(2, 2, 2), 6, 'crazy full application')
  t.equal(crazy(2, 2)(2), 6, 'crazy 2 first')
  t.equal(crazy(2)(2, 2), 6, 'crazy 1 first')
  t.equal(crazy(2)(2)(2), 6, 'crazy fully curried')

  t.equal(crazier(2, 2, 2), 6, 'crazier full application')
  t.equal(crazier(2, 2)(2), 6, 'crazier 2 first')
  t.equal(crazier(2)(2, 2), 6, 'crazier 1 first')
  t.equal(crazier(2)(2)(2), 6, 'crazier fully curried')

  t.end()
})
