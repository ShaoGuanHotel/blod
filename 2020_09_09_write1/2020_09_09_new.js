function myNew(fn, ...params) {
  if (!(fn instanceof Function)) {
    throw new TypeError('not a function')
  }
  const obj = {}
  obj.__proto__ = fn.prototype
  const result = fn.apply(obj, params)
  return typeof result === 'object' ? result : obj
}

function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.hello = function () {
  console.log(`my name is ${this.name},I am ${this.age} years old`)
}

const p = myNew(Person, 'hotel', 26)
console.log('>>>>>>>>>>>>> p >>>>>>>>>>>>>>>>', p)
p.hello()
