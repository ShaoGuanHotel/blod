Function.prototype.myBind = function (content, ...defaultArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('not a funcion')
  }
  const fn = this
  return function F(...otherArgs) {
    const args = [...defaultArgs, ...otherArgs]
    if (this instanceof F) {
      return new fn(...args)
    }
    return fn.apply(content, args)
  }
}

function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.hello = function () {
  console.log(`my name is ${this.name},I am ${this.age} years old`)
}

const P2 = Person.myBind('固定', '固定age')
const p = new P2('a', 12)
p.hello()
console.log(p.age)
