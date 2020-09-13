const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 支持异步的promise
class MyPromise {
  constructor(excuter) {
    this.status = PENDING
    this.value = ''
    this.reason = ''

    this.succesFns = []
    this.errorFns = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
        this.succesFns.forEach((fn) => fn(this.value))
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

  then(
    succesFn = () => {},
    errorFn = (e) => {
      console.error(e)
    }
  ) {
    if (this.status === FULFILLED) {
      succesFn(this.value)
    }
    if (this.status === REJECTED) {
      errorFn(this.reason)
    }
    if (this.status === PENDING) {
      this.succesFns.push(() => succesFn(this.value))
      this.errorFns.push(() => errorFn(this.reason))
    }
  }
}

// 异步
new MyPromise((resolve, reject) => {
  console.log('老板曰: 一秒做完手上的事来一下我办公室,做不完滚蛋')
  setTimeout(() => {
    if (true) { // 臣妾做不到啊
      resolve('做完了手上的事,去老板办公室')
    } else {
      reject('做不完,滚蛋')
    }
  }, 2000)
}).then(res => {
  console.log(`1s 后:${res}`)
}, error => {
  console.log(`1s 后:${error}`)
})