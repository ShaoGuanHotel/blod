Function.prototype.myCall = function (content = window, ...params) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function')
  }
  content.fn = this
  const result = content.fn(...params)
  delete content.fn
  return result
}

function test(a, b) {
  console.log(`my name is ${this.name},I am ${this.age} years old`, a, b)
}

test.myCall({ name: 'hotel', age: 26 }, 'a', 'b')
