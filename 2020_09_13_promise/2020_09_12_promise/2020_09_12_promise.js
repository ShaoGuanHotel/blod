const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(excuter) {
    this.value = ''
    this.reason = ''
    this.status = PENDING

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = FULFILLED
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
      }
    }

    try {
      excuter(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(
    successFn = () => {},
    errorFn = (error) => {
      console.error('not catch error' + error)
    }
  ) {
    if (this.status === FULFILLED) {
      successFn(this.value)
    }
    if (this.status === REJECTED) {
      errorFn(this.reason)
    }
  }
}

// new MyPromise(resolve => {
//   console.log('before resolve')
//   resolve(1)
// }).then(res => {
//   console.log(res)
// })

// new MyPromise((resolve, reject) => {
//   console.log('before reject')
//   reject('reject error')
// }).then(res => {
//   console.log(res)
// }, error => {
//   console.log(error)
// })

new MyPromise((resolve) => {
  console.log('before resolve')
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then((res) => {
  console.log(res)
})
