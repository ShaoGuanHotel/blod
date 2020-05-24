

## JavaScript好用还未火的注解@Decorator（注解|装饰器|装潢器）

[TOC]

### 一、阅读收获

1. What（是什么）-Why（为什么）-How（怎么用）-Where（哪里用）阐述方法论；
2. AOP编程思想；
3. JavaScript注解的弊端；
4. 如何定义注解；
5. 自定义注解如何传参；
6. 优雅的异常处理；
7. 如何判断一个函数为异步函数；

### 二、What：是什么

#### 1. AOP思想

​	先了解一下火于后端的一个编程思想：`AOP`( Aspect Oriented Programming ：面向切面编程)。 也叫做面向方法编程，是通过预编译方式和运行期动态代理的方式实现不修改源代码的情况下给程序动态统一添加功能的技术 。详见：[AOP 面向切面编程]( https://www.jianshu.com/p/f1770b9dce27 )。概括文章主要思想：

1. `AOP`面对业务处理过程中的某个步骤或阶段，降低业务流程步骤间的耦合度；
2. 与业务无关，被多个业务模块共同调用的逻辑可定义为一个`Aspect`切面
3. `AOP`是`OOP`（封装、继承，多态）的补充和完善，`AOP`实现分散关注点；
4. `AOP`是典型的代理模式体现；
5. 应用场景包括日志记录、性能统计、安全控制、事务处理、异常处理等。

#### 2. JavaScript的AOP

​	`JavaScript`：同为`C`系列语言，`Java`的`AOP`那么好用，我也要（磨刀霍霍向猪羊，期待的小眼神）。

 	注解无疑是对`AOP`最有力的设计，在`ES5`时代，可以通过 `Object.defineProperty` 来对对象属性／方法 进行访问修饰，但用起来需要写一堆东西；在`ES6`时代，可以通过`Proxy`来对对象属性 / 方法进行访问修饰。Decorator已经在`ES7`的提案中，也就是叫你敬请期待；借助Babel转码工具，我们可以先吃螃蟹。

​	Decorator，可以不侵入原有代码内部的情况下修改类代码的行为，处理一些与具体业务无关的公共功能，常见：日志，异常，埋码等。[ES7 Decorator提案]( https://github.com/wycats/javascript-decorators )描述如下：

A decorator is:

1. an expression（一个表达式）
2. that evaluates to a function（等价于一个函数）
3. that takes the target, name, and decorator descriptor as arguments（参数有target，name，descriptor ）
4. and optionally returns a decorator descriptor to install on the target object（可选的返回一个装饰器描述符以安装在目标对象上）

思想倒是理解了，上面的翻译可能有出入，因为老感觉第4点翻译的不够贴切，欢迎斧正。

### 三、Why：为什么

#### 1. 为什么要用Decorator

​	首先抛开“迎合”后端开发人员的`Class`写法，对应会引入的相关概念和特性，当然随着前端业务的发展，有时候也需要对应的特性。比如：`private`,`static`等只见于`Java`的特性，现如今通过Class语法糖能在前端实现同样的特性，换汤不换药，语法糖底层还是通过原生`JavaScript`来模拟实现相关特性的。前端`Class`编写风格更加"后端"，那么就更容易吸引一大波后端人员学习和使用`Javascript`，`Javascript`一统编程界“指日可待”。后端都学`Javascript`了，这让纯前端压力山大，我们要加快学习的脚步才行，技多不压身，举一反三学习，把后端的空气都咬完，让后端无法呼吸。

​	其次举个栗子阐述为什么要用`Decorator`：现实生活中我们可能也遇到过，百度过一个商品后，打开淘宝京东后，淘宝京东便能精准的推荐该商品的相关广告，大数据时代，我们慢慢越来越透明。转换为专业术语：埋码。

​	埋码具体需求如下：大数据时代，数据就是金钱，业务方需要统计用户对某些功能的使用情况，比如使用时间，频率，用户习惯等。对应后端会提供一个埋码接口，用户调用功能的时候，前端需要 **侵入式** 的在所有需要统计的功能前调用后端埋码接口。

原始写法：

``` javascript
// 埋码 监听用户使用情况
function monitor(name) {
  console.log(`调用监听接口，发送监听数据 : ${name}`)
}

class PageAPI {
  onWatch() {
    monitor('侵入式：帅哥靓妹X访问了xxx')
    console.log('原访问页面逻辑')
  }
  onLike() {
    monitor('侵入式：帅哥靓妹X点赞了xxx')
    console.log('原点赞正常逻辑')
  }
  onAttention() {
    monitor('侵入式：帅哥靓妹X关注了xxx')
    console.log('原关注正常逻辑')
  }
  onBack(){
    console.log('退出相关逻辑，不需要监听')
  }
}
const page = new PageAPI()
// 各种暗示点赞，关注，各位看官你懂的，哈哈
page.onWatch()
page.onLike()
page.onAttention()
page.onBack()
```

打印结果：

02.png

<span id="why">使用注解写法如下</span>：

``` javascript
// 埋码 监听用户使用情况
function monitor(name) {
  // 注意：
  // 实际中埋码数据是从一个单例store里面取
  // 比如，用户名，访问时间等
  // 操作类型可作为注解参数
  console.log(`调用监听接口，发送监听数据 : ${name}`)
}

/**
  Decorator 定义:
  1. an expression（一个表达式）
  2. that evaluates to a function（等价于一个函数）
  3. that takes the target, name, and decorator descriptor as arguments（参数有target，name，descriptor ）
  4. and optionally returns a decorator descriptor to install on the target object（可选的返回一个装饰器描述符以安装在目标对象上）
 * @param {*} name 
 */
const monitorDecorator = (name) => { // Decorator 定义2
  return (target, propertyKey, descriptor) => {// Decorator 定义3
    const func = descriptor.value
    return { // Decorator 定义4
      get() {
        return (...args) => {
          monitor(name) // 埋码
          func.apply(this, args) // 原来逻辑
        }
      },
      set(newValue) {
        return newValue
      }
    }
  }
}

class PageAPI {
  @monitorDecorator('Decorator：帅哥靓妹X访问了xxx') // Decorator 定义1
  onWatch() {
    console.log('原访问页面逻辑')
  }
  @monitorDecorator('Decorator：帅哥靓妹X点赞了xxx')
  onLike() {
    console.log('原点赞正常逻辑')
  }
  @monitorDecorator('Decorator：帅哥靓妹X关注了xxx')
  onAttention() {
    console.log('原关注正常逻辑')
  }
  onBack() {
    console.log('退出相关逻辑，不需要监听')
  }
}
const page = new PageAPI()
// 各种暗示点赞，关注，各位看官你懂的，哈哈
page.onWatch()
page.onLike()
page.onAttention()
page.onBack()
```

打印结果：

03.png

经过上面的栗子应该能直观的感受到面向切面编程核心：非侵入式，解耦。

#### 2. 为什么Decorator还未火

不火的原因主要为：

1. 还在`ES7`提案中，还未得到官方支持；
2. 对Function写法支持不友善，很多用户和框架依然都用Function写法，比如：Vue 3.0、React Hook等都推崇Function写法，毕竟`Javascript`从骨子里就是用Function编程。
3. 注解暂时不能串联，存在覆盖问题；

### 四、How：怎么用

​	目前标准还未支持Decorator，但是Babel已经支持相关写法，我们可以通过`get`、`set`来模拟实现。根据注解不同的切入点可以分为：`Class`,`Method`和`Property`三种`Decorator`。顺带介绍一下原生Function如何实现面向切面编程。

#### 1. Babel支持

​	在自我搭建的Webpack项目中使用`Decorator`，运行项目编译失败，终端报错，并提供了对应的解决方法。按照提示操作，便能在自我搭建的webpack项目使用`Decorator`了。

01.png

​	另外，亲测，在新版Vue-cli项目中已经默认支持`Decorator`写法了

#### 2. Class Decorator

​	切入点为`Class`，修饰整个Class，可以读取和修改类的方法和属性。需要传递参数，可以通过高阶的函数来实现传递参数，如下面的classDecoratorBuilder。

``` javascript
// 埋码 监听用户使用情况
function monitor(name) {
  console.log(`调用监听接口，发送监听数据 : ${name}`)
}

const classDecoratorBuilder = (dataMap) => {
  return target => {
    // ! 此处不能用 Object.entries(target.prototype) --> []
    Object
      .getOwnPropertyNames(target.prototype)
      .forEach(key => {
        console.log(target)
        if (!['onBack'].includes(key)) { // 屏蔽某些操作
          const func = target.prototype[key]
          target.prototype[key] = (...args) => {
            monitor(dataMap[key] || '埋码数据') // 埋码
            func.apply(this, args) // 原来逻辑
          }
        }
      })
    return target
  }
}
const dataMap = {
  onWatch: 'class Decorator：帅哥靓妹X访问了xxx',
  onLike: 'class Decorator：帅哥靓妹X点赞了xxx',
  onAttention: 'class Decorator：帅哥靓妹X关注了xxx',
}
const classDecorator = classDecoratorBuilder(dataMap)

@classDecorator
class PageAPI {
  onWatch() {
    console.log('原访问页面逻辑')
  }
  onLike() {
    console.log('原点赞正常逻辑')
  }
  onAttention() {
    console.log('原关注正常逻辑')
  }
  onBack() {
    console.log('退出相关逻辑，不需要监听')
  }
}
const page = new PageAPI()
// 各种暗示点赞，关注，各位看官你懂的，哈哈
page.onWatch()
page.onLike()
page.onAttention()
page.onBack()
```

运行结果如下：

04.png

#### 3. Methods Decorator

​	切入点为Method，修饰方法，和Class注解功能相似，能额外的获取修饰的方法名。详见 [Why](#why) 中的栗子。这里就不赘述了。

#### 4. Property Decorator

​	切入点为属性，修饰属性，和Class注解功能功能相同，能额外的获取修饰的属性名。

``` javascript
const propertyDecorator = (target, propertyKey) => {
  Object.defineProperty(target, propertyKey, {
    get() {
      return 'property-decorator-value'
    },
    set(val) {
      return val
    }
  })
}
class Person {
  @propertyDecorator
  private name = 'default name'
  sayName(){
    console.log(`class Person name = ${this.name}`)
  }
}
new Person().sayName()
```

运行结果如下：

05.png

#### 5. 注解优先级，串联

​	Java的注解功能强大，不仅有丰富的注解，而且注解还可以串联。**坏消息**：亲测JavaScript注解不能串联，存在覆盖问题，也就是优先级关系：Method Decorator>Class Decorator。当一个Method上定义了注解，则Class注解则不起作用。希望ES7标准能解决这个痛点。

``` javascript
const classDecoratorBuilder = (name) => {
  return target => {
    Object
      .getOwnPropertyNames(target.prototype)
      .forEach(key => {
        const func = target.prototype[key]
        target.prototype[key] = (...args) => {
          console.log(`>>>>> class-decorator ${name}`)
          func.apply(this, args)
        }
      })
    return target
  }
}
const methodDecoratorBuilder = (name) => {
  return (target, propertyKey, descriptor) => {
    const func = descriptor.value
    return {
      get() {
        return (...args) => {
          console.log(`>>>>> method-decorator ${name}`)
          func.apply(this, args) 
        }
      },
      set(newValue) {
        return newValue
      }
    }
  }
}
const classDecorator1 = classDecoratorBuilder(1)
const classDecorator2 = classDecoratorBuilder(2)
const methodDecorator1 = methodDecoratorBuilder(1)
const methodDecorator2 = methodDecoratorBuilder(2)
const propertyDecorator = (target, propertyKey) => {
  Object.defineProperty(target, propertyKey, {
    get() {
      return 'property-decorator-value'
    },
    set(val) {
      return val
    }
  })
}

// Decorator不能串联
// @classDecorator1
@classDecorator2
class Person {
  @propertyDecorator
  private name = 'default name'

  // @methodDecorator1 // 不能串联，会报错
  @methodDecorator2 // class Decorator会被覆盖
  sayName() {
    console.log('sayName : ', this.name)
  }

  eat(food) {
    console.log('eat : ', food)
  }
}
const person = new Person()
person.sayName()
person.eat('rice')
```

​	运行结果如下：

06.png

#### 6. Function的“`Decorator`”

​	注解目前只能应用于Class，不能用于修饰Function，因为Function的执行上下文是不确定的，太灵活了。但是AOP编程思想是先进的，合理的。我们可以采用不同的形式来实现Function的AOP，虽然没注解那么优雅。通过这种方式还可以解决注解串联的痛点。

``` javascript
function monitor(name) {
  console.log(`调用监听接口，发送监听数据 : ${name}`)
}
const functionAOP = (name, fn) => {
  return (...args) => {
    monitor(name)
    fn.apply(this, args)
  }
}

let onWatch = (pageName) => {
  console.log('原访问页面逻辑，访问页面：', pageName)
}
let onLike = (pageName) => {
  console.log('原点赞正常逻辑，求点赞：', pageName)
}
let onAttention = (author) => {
  console.log('原关注正常逻辑，求关注：', author)
}
// 类似注解
onWatch = functionAOP(
  '****我串联啦****',
  functionAOP('functionAOP:帅哥靓妹X访问了xxx', onWatch)
)
onLike = functionAOP('functionAOP:帅哥靓妹X点赞了xxx', onLike)
onAttention = functionAOP('functionAOP:帅哥靓妹X关注了xxx', onAttention)

onWatch('JavaScript好用还未火的注解@Decorator')
onLike('JavaScript好用还未火的注解@Decorator')
onAttention('JS强迫症患者')
```

​	运行结果如下：

07.png

### 五、Where：哪里用

​	AOP在前端的应用场景包括**日志记录、统计、安全控制、事务处理、异常处理、埋码**等与业务关联性不强的功能。上面栗子以及详细介绍了AOP在埋码上的应用，下面再详细介绍一个常用场景：异常处理。

#### 1. 异常处理背景

​	一个好的应用，用户体验要良好，当用户使用核心功能，无论功能是否成功，都希望得到一个信息反馈，而不是感觉不到功能是否有运行，是否成功。核心功能运行成功的时候弹出消息：xxx功能成功；失败的时候弹出错误：xxx功能失败，请xxx之类。

​	废话不多说，直接撸代码。由于是模拟代码，一是为了节省时间，二是客官可以一览无遗，博主就不拆解文件了。合理的结构应该将api，Decorator，页面逻辑拆解到对应文件中，以供复用。

​	生成模拟接口的公共代码：

``` javascript
const promiseAPIBuilder = (code) => { // 模拟生成各种接口
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 0) {
        resolve({
          code,
          message: 'success',
          data: []
        })
      } else if (code === 404) {
        reject({
          code,
          message: '接口不存在'
        })
      } else {
        reject({
          code,
          message: '服务端异常'
        })
      }
    }, 1000)
  })
}
```

#### 2. 实现方式1：多catch

​	我们可以修改axios拦截器，当状态code非0的时候一律认为功能失败，统一reject错误信息，最后在API调用处catch内统一做错误信息弹出。**相应弊端**：多处接口调用处都需要增加与业务无关的catch方法或者用try catch处理。

``` javascript
const api = {
  successAPI() {
    return promiseAPIBuilder(0)
  },
  error404API() {
    return promiseAPIBuilder(404)
  },
  errorWithoutCatchAPI() { // 没有catch error
    return promiseAPIBuilder(500)
  }
}

const successAPI = async () => {
  const res = await api
    .successAPI()
    .catch(error => console.log(`多个catch的error : ${error.message}`))
  if (!res) return
  console.log('接口调用成功后的逻辑1')
}
successAPI()

const error404API = async () => {
  const res = await api
    .error404API()
    .catch(error => console.log(`消息提示：多个catch的error : ${error.message}`))
  if (!res) return
  console.log('接口调用成功后的逻辑2')
}
error404API()

const errorWithoutCatchAPI = async () => {
  const res = await api.errorWithoutCatchAPI() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑3')
}
errorWithoutCatchAPI()
```

运行结果：

08.png

#### 3. 实现方式2：全局catch

​	定义全局异常处理函数。**相应弊端**：情况多的话需要做很多case判断，因为引用很多没拦截的异常都会跑到全局异常处理函数。

``` javascript
const api = {
  successAPI() {
    return promiseAPIBuilder(0)
  },
  error404API() {
    return promiseAPIBuilder(404)
  },
  errorWithoutCatchAPI() { // 没有catch error
    return promiseAPIBuilder(500)
  }
}

// 统一处理
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason.code === 404) {
    console.log(`
		消息提示：统一catch的error,
		需要通过if或者switch判断处理流程 : 
		${event.reason.message}
	`)
  }
})

const successAPI = async () => {
  const res = await api.successAPI() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑1')
}
successAPI()

const error404API = async () => {
  const res = await api.error404API() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑2')
}
error404API()

const errorWithoutCatchAPI = async () => {
  const res = await api.errorWithoutCatchAPI() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑3')
}
errorWithoutCatchAPI()
```

运行结果：

09.png

#### 3. 优雅的实现方式3：注解

注解修饰API接口管理文件。虽说也有Class写法的限制，但是我们可以通过其他方式避开这个限制。**注意带*号的代码**

``` javascript
// ****** catch error Decorator 构造器
const showTipDecoratorBulder = (errorHandler) => (target, propertyKey, descriptor) => {
  const func = descriptor.value
  return {
    get() {
      return (...args) => {
        return Promise
          .resolve(func.apply(this, args))
          .catch(error => {
            errorHandler && errorHandler(error)
          })
      }
    },
    set(newValue) {
      return newValue
    }
  }
}
// ****** 构造一个提示错误的注解
const showTipDecorator = showTipDecoratorBulder((error) => {
  console.log(`Decorator error 消息提示 : ${error.message}`)
})

// ****** class 写法避开限制
class PageAPI {
  @showTipDecorator
  successAPI() {
    return promiseAPIBuilder(0)
  }
  @showTipDecorator
  error404API() {
    return promiseAPIBuilder(404)
  }
  errorWithoutCatchAPI() {
    return promiseAPIBuilder(500)
  }
}
const api = new PageAPI()

const successAPI = async () => {
  const res = await api.successAPI() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑1')
}
successAPI()

const error404API = async () => {
  const res = await api.error404API() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑2')
}
error404API()

const errorWithoutCatchAPI = async () => {
  const res = await api.errorWithoutCatchAPI() // error 没有 catch
  if (!res) return
  console.log('接口调用成功后的逻辑3')
}
errorWithoutCatchAPI()
```

运行结果：

10.png

附送：如何判断一个函数为AsyncFucntion。

``` javascript
/**
 * 附送：如何判断一个函数为AsyncFucntion
 */
const asyncFn = async _ => _
const fn = _ => _
// AsyncFucntion非JS内置对象，不能直接通过如下方式判断
// console.log('<<<< asyncFn instanceof AsyncFucntion <<<', asyncFn instanceof AsyncFucntion)
console.log('<<<< asyncFn instanceof Function <<<', asyncFn instanceof Function) // true
console.log('<<<< fn instanceof Function <<<', fn instanceof Function) // true

const AsyncFucntion = Object.getPrototypeOf(async _ => _).constructor
console.log('<<<< asyncFn instanceof AsyncFucntion <<<', asyncFn instanceof AsyncFucntion) // true
console.log('<<<< fn instanceof AsyncFucntion <<<', fn instanceof AsyncFucntion) // false
```

运行结果：

11.png

