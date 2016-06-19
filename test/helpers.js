const noop          = () => {}
const bindFunc      = fn => x => fn.bind(null, x)
const validObserver = () => ({ next: noop })

module.exports = { noop, bindFunc, validObserver }
