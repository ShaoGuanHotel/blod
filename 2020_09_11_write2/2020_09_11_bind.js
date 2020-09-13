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
    } else {
      return fn.apply(content, args)
    }
  }
}

function Person(name, age, from) {
  this.name = name
  this.age = age
  this.from = from
}
Person.prototype.hello = function () {
  const { name, from, age } = this
  console.log(`my name is ${name},I am ${age} years old from ${from}`)
}

const PBind = Person.myBind('固定name', '固定age')
const p = new PBind()
p.hello()
console.log(p.age)
console.log(p.from)

const PBind2 = Person.bind('固定name2', '固定age2')
const p2 = new PBind2( )
p2.hello()
console.log(p2.age)
console.log(p2.from)
