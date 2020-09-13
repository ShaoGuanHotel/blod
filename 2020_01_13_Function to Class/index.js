(() => {
class Animal {
  static Is = 'Animal' // 静态属性
  constructor({
    type,
    name
  }) { // 构造器函数
    this.type = type
    this.name = name
    // 对象上特有的方法
    this.sleep = time => console.log(this.name, 'sleep', time)
  }
  eat() { // 原型上的方法
    console.log('animai', this.name, 'eat')
  }
  drink() {
    console.log('animal', this.name, 'drink')
  }
}

class Dog extends Animal {
  static Is = 'Dog'
  constructor({
    name,
    color
  }) {
    super({
      name,
      type: 'Dog'
    })
    this.color = color
  }
  // 新增Dog的原型方法
  bark() {
    console.log('dog', this.name, 'is barking')
  }
  // 覆写原型上的方法
  eat() {
    console.log('dog', this.name, 'is eating')
  }
}

const dog = new Dog({
  name: 'bobi',
  color: 'white'
})
dog.eat()
dog.bark()
dog.drink()
dog.sleep('3h')
console.log('class', dog)
})()

// 寄生组合式继承
(() => {
function inherit(prototype) {
  function F() {}
  F.prototype = prototype
  return new F()
}

function connect(SubClass, SuperClass) {
  const prototype = inherit(SuperClass.prototype)
  prototype.constructor = SubClass
  SubClass.prototype = prototype
}

function Animal({ // Animal构造器函数
  type,
  name
}) {
  this.type = type
  this.name = name
  this.sleep = time => console.log(this.name, 'sleep', time)
}
Animal.Is = 'Animal' // 静态属性 类比 static Is = ...
Animal.prototype = { // Animal的原型 
  constructor: Animal,
  eat() {
    console.log('animai', this.name, 'eat')
  },
  drink() {
    console.log('animal', this.name, 'drink')
  }
}

function Dog({
  name,
  color
}) {
  // 类比 super(...)
  Animal.call(this, {
    name,
    type: 'Dog'
  })
  this.color = color
}
Dog.Is = 'Dog'
connect(Dog, Animal) // 关联原型
// 新增Dog的原型方法
Dog.prototype.bark = function () {
  console.log('dog', this.name, 'is barking')
}
// 覆写原型上的eat方法
Dog.prototype.eat = function () {
  console.log('dog', this.name, 'is eating')
}

const dog = new Dog({
  name: 'bobi',
  color: 'white'
})
dog.eat()
dog.bark()
dog.drink()
dog.sleep('3h')
console.log('function', dog)
})()