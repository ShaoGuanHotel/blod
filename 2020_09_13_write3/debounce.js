// 防抖
function debounce(fn, await) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), await)
  }
}
