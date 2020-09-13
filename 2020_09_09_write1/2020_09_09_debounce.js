function debounce(fn, await = 60) {
  let timer = null
  return function (...parms) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, parms), await)
  }
}
