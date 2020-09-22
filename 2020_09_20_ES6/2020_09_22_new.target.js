function Person(name) {
  if (!(this instanceof Person)) {
    throw new Error('Person 只能new')
  }
  this.name = name
}
console.log(new Person('a'))

function Person2(name) {
  if (new.target !== Person2) {
    throw new Error('Person2 只能new')
  }
  this.name = name
}
console.log(new Person('b'))
