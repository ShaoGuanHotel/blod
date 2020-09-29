const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')
const defaultFn = (_) => _

class MyPromise {
  reason = null
  value = null
  status = PENDING
  successFns = []
  errorFns = []
  constructor(excuter) {
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
        this.successFns.forEach((fn) => fn(this.value))
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.errorFns.forEach((fn) => fn(this.reason))
      }
    }

    try {
      excuter(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(successFn, errorFn) {
    successFn = successFn || defaultFn
    errorFn = errorFn || defaultFn

    if (this.status === FULFILLED) {
      successFn(this.value)
    }
    if (this.status === REJECTED) {
      errorFn(this.reason)
    }
    if (this.status === PENDING) {
      this.successFns.push(() => successFn(this.value))
      this.errorFns.push(() => errorFn(this.reason))
    }
  }
  catch(fn) {
    return this.then(null, fn)
  }
  final(fn) {
    return this.then(fn)
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value))
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }
  static race(promises) {
    if (!promises[Symbol.iterator]) {
      throw 'cant found iterator from promises'
    }
    return new MyPromise((resolve, reject) => {
      promises = [...promises].map((promise) => (promise instanceof MyPromise ? promise : MyPromise.resolve(promise)))
      promises.forEach((promise) => promise.then(resolve, reject))
    })
  }
  static all(promises) {
    if (!promises[Symbol.iterator]) {
      throw 'cant found iterator from promises'
    }
    return new MyPromise((resolve, reject) => {
      promises = [...promises].map((promise) => (promise instanceof MyPromise ? promise : MyPromise.resolve(promise)))
      let successTime = 0
      const result = []
      const setValue2Result = (i, value) => {
        result[i] = value
        if (++successTime === promises.length) {
          resolve(result)
        }
      }
      promises.forEach((promise, i) =>
        promise.then(
          (value) => setValue2Result(i, value),
          (error) => reject(error)
        )
      )
    })
  }
}

// 模拟api
const newAPI = (value, time) =>
  new MyPromise((resolve, reject) => {
    // 10秒超时
    if (time > 10) {
      setTimeout(() => {
        reject('10秒超时')
      }, 6000)
    } else {
      setTimeout(() => {
        resolve(value)
      }, time * 1000)
    }
  })

const promises = [newAPI(1, 1), newAPI(2, 2), newAPI(3, 11), 4]
MyPromise.all(promises).then(
  ([res1, res2, res3, res4]) => {
    console.log(res1)
    console.log(res2)
    console.log(res3)
    console.log(res4)
  },
  (error) => console.error('error -- ', error)
)
