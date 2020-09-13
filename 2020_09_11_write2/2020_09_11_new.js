function myNew(fn, ...args) {
  if(typeof fn !== 'function'){
    throw new TypeError('not a function')
  }
  const obj = {}
  obj.__proto__ = fn.prototype
  const result = fn.apply(obj, args)
  return typeof result === 'object' ? result : obj
}
