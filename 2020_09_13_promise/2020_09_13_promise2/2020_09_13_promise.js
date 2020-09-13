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

  // catch是一个特殊的then
  catch(errorFn) {
    return this.then(null, errorFn)
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value))
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => reject(value))
  }

  // race看谁抢先修改MyPromise的状态
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => promise.then(resolve, reject))
    })
  }

  // 所有promise并行请求,当所有promise resolve值后统一resolve,
  // 如果有reject,直接reject
  static all(promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('MyPromise.all(xxx) xxx must be array')
    }
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        resolve([])
      } else {
        const result = []
        let successTime = 0 // 成功回调次数
        const put2result = (index, value) => {
          // 将值放到对应位置
          result[index] = value
          if (++successTime === promises.length) {
            resolve(result)
          }
        }
        promises = promises.map((promise) => (promise instanceof MyPromise ? promise : MyPromise.resolve(promise)))
        promises.forEach((promise, i) => {
          promise.then(
            (res) => put2result(i, res),
            (error) => reject(error)
          )
        })
      }
    })
  }
}

// 异步
// new MyPromise((resolve, reject) => {
//   console.log('老板曰: 一秒做完手上的事来一下我办公室,做不完滚蛋')
//   setTimeout(() => {
//     if (false) {
//       // 臣妾做不到啊
//       resolve('做完了手上的事,去老板办公室')
//     } else {
//       reject('做不完,滚蛋')
//     }
//   }, 1000)
// }).then(
//   (res) => {
//     console.log(`1s 后:${res}`)
//   },
//   (error) => {
//     console.log(`1s 后:${error}`)
//   }
// )

// MyPromise.resolve('aaa').then((res) => console.log('MyPromise.resolve', res))

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

const promises = [newAPI(1, 1), newAPI(2, 2), newAPI(3, 3), newAPI(4, 40)]
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
