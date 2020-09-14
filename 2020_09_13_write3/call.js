Function.prototype.myCall = function (content = window, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function')
  }
  const fnName = Symbol('functionName')
  content[fnName] = this
  const result = content[fnName](...args)
  delete content[fnName]
  return result
}
