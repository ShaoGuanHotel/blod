Function.prototype.myCall = function (content, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function')
  }
  const fnName = Symbol('myCall')
  content[fnName] = this
  const result = content[fnName](...args)
  delete content[fnName]
  return result
}
function test(a, b) {
  console.log(`my name is ${this.name},I am ${this.age} years old`, a, b)
  return 1
}
var content = {
  name: 'hotel',
  age: 26,
  fn: 111,
}
console.log(test.myCall(content, 'a', 'b'))
