function throttle(fn, await = 50) {
  if (typeof fn !== 'function') {
    throw new TypeError('not a function')
  }
  let timer = null
  return function (...args) {
    if (timer == null) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, await)
    }
  }
}
