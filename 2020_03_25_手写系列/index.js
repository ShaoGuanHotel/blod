/**
 * 1.手写new（new的过程）
 * 
 */
(() => {
  function MyNew(fn, ...args) {
    if (!(fn instanceof Function)) {
      throw new TypeError('not a constructor')
    }
    const obj = {}
    obj.__proto__ = fn.prototype
    const retult = fn.call(obj, ...args)
    return typeof result === 'object' ? retult : obj
  }

  // 不能用class定义，class定义只能通过new生产对象
  function Person(age, name) {
    this.age = age
    this.name = name
  }
  Person.prototype.hallo = function () {
    console.log(`name:${this.name},age:${this.age}`)
  }
  console.log('----------------------手写new-----------------------')
  MyNew(Person, 18, 'coco').hallo()
})();

/**
 * 2. call（绑定this指针）
 */
(() => {
  Function.prototype.myCall = function (content = window, ...args) {
    if (typeof this !== 'function') {
      throw new TypeError('not a function')
    }
    content.fn = this
    const result = content.fn(...args)
    delete content.fn
    return result
  }

  function test(age) {
    console.log(`name:${this.name},age:${age}`)
  }
  console.log('----------------------手写call-----------------------')
  test(18)
  test.call({
    name: 'coco'
  }, 18)
  delete Function.prototype.myCall
})();

/**
 * 3. apply（绑定this指针,数组传参）
 */
(() => {
  Function.prototype.myApply = function (content = window, args) {
    if (typeof this !== 'function') {
      throw new TypeError('not a function')
    }
    content.fn = this
    const result = content.fn(...args)
    delete content.fn
    return result
  }

  function test(age1, age2) {
    console.log(`name:${this.name},age:${age1},age2:${age2}`)
  }
  console.log('----------------------手写apply-----------------------')
  test(18, 19)
  test.myApply({
    name: 'coco'
  }, [18, 19])
  delete Function.prototype.myApply
})();

/**
 * 4. bind（固定this指针）
 * 和call，apply类似，只是返回函数
 * 支持柯里花
 */
(() => {
  Function.prototype.myBind = function (content, ...defaultArgs) {
    if (typeof this !== 'function') {
      throw new TypeError('not a function')
    }
    const fn = this
    return function F(...args) {
      const as = [...defaultArgs, ...args]
      if (this instanceof F) { // new 的过程
        return new fn(...as)
      } else {
        return fn.apply(content, as)
      }
    }
  }

  function test(age1, age2) {
    console.log(`name:${this.name},age:${age1},age2:${age2}`)
  }
  console.log('----------------------手写bind-----------------------')
  test(18, 19)
  const boundTest = test.bind({
    name: 'coco'
  }, 18) // 绑定的时候同时可以柯里化
  boundTest(19)
  delete Function.prototype.myBind
})();


/**
 * 5.防抖（短时间内多次触发不执行）
 */
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    timer && window.clearTimeout(timer) // 短时间触发多次会以最后一次定时计时，计时结束执行一次函数
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
var testDebounce = {
  clickTime: 0, // 点击次数
  runTime: 0 // 执行次数
}

function willDebounceClick() {
  this.runTime++
  console.log(`run time ${this.runTime}`)
}

function onBtnClick() {
  this.clickTime++
  console.log(`click time ${this.clickTime}`)
}
console.log('----------------------手写debounce-----------------------')
var btn = document.getElementById('debounceBtn')
btn.addEventListener('click', debounce(willDebounceClick.bind(testDebounce), 1000))
btn.addEventListener('click', onBtnClick.bind(testDebounce))

/**
 * 6.节流（规定时间只能触发一次）
 * timeScale:时间间隔
 */
function throttle(fn, timeScale = 100) {
  let prev = new Date() // 上一次执行的时间
  return function (...args) {
    const now = new Date()
    if (now - prev >= timeScale) {
      fn.apply(this, args)
      prev = now
    }
  }
}
var throttleTest = {
  scrollTime: 0,
  throttleScrollTime: 0
}
var scrollDiv = document.getElementById('scrollDiv')

function willThrottleScroll() {
  this.throttleScrollTime++
  console.log(`11111111111111 throll run time:${this.throttleScrollTime}`)
}

function onScroll() {
  this.scrollTime++
  console.log(`scroll run time:${this.scrollTime}`)
}
console.log('----------------------手写节流-----------------------')
window.addEventListener('scroll', throttle(willThrottleScroll.bind(throttleTest), 300))
window.addEventListener('scroll', onScroll.bind(throttleTest))