const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'
class myPromise {
  constructor(executor) {
    this.status = STATUS_PENDING
    this.value = ''
    this.reason = ''

    let resolve = value => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED
        this.value = value
      }
    }
    let reject = reason => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED
        this.reason = reason
      }
    }
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled = () => {}, onRejected = () => {}) {
    if (this.status === STATUS_FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === STATUS_REJECTED) {
      onRejected(this.reason)
    }
  }
}

new myPromise(resolve => {
  console.log('before resolve')
  resolve(1)
}).then(res => {
  console.log(res)
})

new myPromise((resolve, reject) => {
  console.log('before reject')
  reject('reject error')
}).then(res => {
  console.log(res)
}, error => {
  console.log(error)
})