const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(excuter) {
    this.value = ''
    this.reason = ''
    this.status = PENDING
    this.successFns = []
    this.errorFns = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value

        this.successFns.forEach((fn) => fn(this.value))
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
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
    successFn = successFn || ((_) => _)
    successFn = successFn || ((_) => _)
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
    return this.then(undefined, fn)
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value))
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }
  static race(promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('promises must be itearter')
    }
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return resolve()
      }
      promises
        .map((promise) => (promise instanceof MyPromise ? promise : MyPromise.resolve(promise)))
        .forEach((promise) => {
          promise.then(resolve, reject)
        })
    })
  }
  static all(promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('promises must be iterater')
    }
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return resolve([])
      }
      let successTime = 0
      const result = []
      const put2result = (i, val) => {
        result[i] = val
        if (++successTime === promises.length) {
          resolve(result)
        }
      }
      promises
        .map((promise) => (promise instanceof MyPromise ? promise : MyPromise.resolve(promise)))
        .forEach((promise, index) => {
          promise.then(
            (val) => put2result(index, val),
            (error) => reject(error)
          )
        })
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

const promises = [newAPI(1, 1), newAPI(2, 2), newAPI(3, 3), 4]
MyPromise.all(promises).then(
  ([res1, res2, res3, res4]) => {
    console.log(res1)
    console.log(res2)
    console.log(res3)
    console.log(res4)
  },
  (error) => console.error('error -- ',error)
)
;(async () => {
  const data = await newAPI(1, 1) // 竟然也支持自定义的MyPromise
  console.log('await -- ', data)
})()
