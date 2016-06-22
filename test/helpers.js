const noop          = () => {}
const id            = x => x
const bindFunc      = fn => x => fn.bind(null, x)
const validObserver = () => ({ next: noop })

module.exports = {
  noop,
  id,
  bindFunc,
  validObserver
}
