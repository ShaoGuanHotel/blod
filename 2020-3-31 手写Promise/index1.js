const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = ''
    this.reason = ''

    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
        // pending->fulfilled 按照成功清单执行
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason
        // pending->rejected 按照异常清单执行
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled = () => {}, onRejected = () => {}) {
    if (this.state === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.state === REJECTED) {
      onRejected(this.reason)
    }
    // 忙碌状态,先记录老板吩咐的内容
    if (this.state === PENDING) {
      // onFulfilled传入到成功数组
      this.onResolvedCallbacks.push(() => onFulfilled(this.value))
      // onRejected传入到失败数组
      this.onRejectedCallbacks.push(() => onRejected(this.reason))
    }
  }
}

// 异步
new myPromise((resolve, reject) => {
  console.log('老板曰: 一秒做完手上的事来一下我办公室,做不完滚蛋')
  setTimeout(() => {
    if (false) {
      resolve('做完了手上的事,去老板办公室')
    } else {
      reject('做不完,滚蛋')
    }
  }, 1000)
}).then(res => {
  console.log(`1s 后:${res}`)
}, error => {
  console.log(`1s 后:${error}`)
})