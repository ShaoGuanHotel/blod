const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = ''
    this.reason = ''

    let resolve = value => {
      if (this.state === PENDING) {
        this.state = FULFILLED
        this.value = value
      }
    }
    let reject = reason => {
      if (this.state === PENDING) {
        this.state = REJECTED
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
    if (this.state === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.state === REJECTED) {
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