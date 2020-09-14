Function.prototype.myBind = function (content, ...defaultArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function')
  }
  const fn = this
  return function F(...otherArgs) {
    const args = [...defaultArgs, ...otherArgs]
    // new
    if (this instanceof F) {
      return new fn(...args)
    }
    return fn.apply(content, args)
  }
}
