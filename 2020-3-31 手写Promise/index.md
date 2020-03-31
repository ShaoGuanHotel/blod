## 手写Promise

### 1.Promise产生背景及规范

众所周知，Promise是ES6引入的新特性，旨在解决回调地狱。下面是一个简单的例子：控制接口调用顺序：

apiA-->apiB-->apiC。复杂的业务，开发人员会裂开。后生在此向老前辈致敬。

``` javascript
// 回调地狱
apiA({
    handleSuccess(resA){
        apiB({
            handleSuccess(resB){
                apiC({
                    handleSuccess(resC){
                        
                    }
                })
            }
        })
    }
})
```

因此[Promise/A+]( https://promisesaplus.com/ )规范应运而生，ES6的Promise就是遵循规范开发出来的。

### 2. 同步Promise

阅读规范可得下面几点基本要求:

1. Promise存在三个状态：pending（等待态）、fulfilled（成功态）、rejected（失败态）
2. pending为初始态，并可以转化为fulfilled和rejected
3. 成功时，不可转为其他状态，且必须有一个不可改变的值（value）
4. 失败时，不可转为其他状态，且必须有一个不可改变的原因（reason）
5. new Promise(executor=(resolve,reject)=>{resolve(value)})，resolve(value)将状态置为 fulfilled
6. new Promise(executor=(resolve,reject)=>{reject(reson)})，reject(reson)将状态置为 rejected
7. 若是executor运行异常执行reject()
8. thenable：then(onFulfilled, onRejected)
   1. onFulfilled：status为fulfilled，执行onFulfilled，传入value
   2. onRejected：status为rejected，执行onRejected，传入reason

``` javascript
// 1.Promise存在三个状态：pending（等待态）、fulfilled（成功态）、rejected（失败态）
const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'
class myPromise {
  constructor(executor) {
  	// pending为初始态，并可以转化为fulfilled和rejected
    this.status = STATUS_PENDING
    this.value = '' // 3
    this.reason = '' // 4

    let resolve = value => {
    // 5.
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED
        this.value = value
      }
    }
    let reject = reason => {
    //6.
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED
        this.reason = reason
      }
    }
    // 7.
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  // 8.
  then(onFulfilled = () => {}, onRejected = () => {}) {
  	// 8.1
    if (this.status === STATUS_FULFILLED) {
      onFulfilled(this.value)
    }
    // 8.2
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
```

### 3. 异步Promise

``` javascript
new myPromise(resolve => {
  console.log('before resolve')
  setTimeout(()=>{
      resolve(1)
  },1000)
}).then(res => {
  console.log(res)
})
```

promise的状态只能在resolve或者reject的时候改变，同步代码执行到then回调的时候promise的状态还是pending，明细不符合我们的期望。

如果换做是你，你会怎么解决这个问题？举个栗子，你正在处理一堆事情（pending状态），然后（then），老板曰: 一秒内做完手上的事来一下我办公室，做不完滚蛋。你怕忘记，一般会用清单记录onResolvedCallbacks = ['做完了手上的事,去老板办公室']，onRejectedCallbacks = ['做不完,滚蛋']，1秒后看完成结果，再依据选择下一步。

完善后的代码如下：

``` javascript
const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'
class myPromise {
  constructor(executor) {
    this.status = STATUS_PENDING
    this.value = ''
    this.reason = ''

    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];

    let resolve = value => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED
        this.value = value
        // pending->fulfilled 按照成功清单执行
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = reason => {
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED
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
    if (this.status === STATUS_FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === STATUS_REJECTED) {
      onRejected(this.reason)
    }
    // 忙碌状态,先记录老板吩咐的内容
    if (this.status === STATUS_PENDING) {
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
    if (false) { // 臣妾做不到啊
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
// 老板曰: 一秒做完手上的事来一下我办公室,做不完滚蛋
// 1s 后:做不完,滚蛋
```

### 4. new Promise().then().then()...

这个思路倒是挺简单，就是then函数返回值为另一个Promise实例。实现起来就比较huan。

### 5.  catch、resolve、reject、race和all 