`Javascript`本质上是面向函数的一门语言，也就是说`Javascript`的面向对象编程以及继承都不是传统意义上面向对象和继承。个人理解`Javascript`通过原型链实现的面向对象和继承本质上是绑定两个对象间的关系。有过相关面向对象编程经验的同志们不要被面向对象、继承等概念所误导。建议有一定`Javascript`基础的同志们可以细细评味张容铭的《JavaScript设计模式》，相信一定会有更深刻的理解。

​	由于`ES6`对`Class`语法的支持，更加容易让人误解`Javascript`面向对象和继承的本质。以下例子为`Class`定义全量转换为`Function`定义。

1. ### Class定义

   ``` javascript
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
   ```

2. ### Function定义（寄生组合式继承）

   ``` javascript
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
   ```

3. ### 运行结果对比

   

4. ### 总结

   ​		俗话说，万物存在皆有因，无论是`Class`定义还是`Fucntion`定义都有其用武之地，没有最好只有更佳。比如在`React`和`Vue`组件的定义上用`Class`定义就显得十分优美。`Vue`源码采用的是`Fucntion`定义，其目的是将加工`Vue`的代码分离到各个模块去，像汽车流水线对生产的汽车进行加工，添加各种功能，从头到尾只有一辆汽车，一个`Vue`。这个是用`Class`定义办不到的，因为`Class`定义一般定义在一个文件中。

   ​		我们要做和能做的就是对其原理本质的掌握和理解，万变不离其宗。

