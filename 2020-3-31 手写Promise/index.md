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

这个思路倒是挺简单，就是then函数返回值为另一个Promise实例。根据规范修改后如下：

``` javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 防止多次调用
  let called;
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // resolve的结果依旧是promise 那就继续解析
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          reject(err); // 失败了就失败了
        })
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e);
    }
  } else {
    resolve(x);
  }
}

class Promise {
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
  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，扔出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === FULFILLED) {
        // 异步解决：
        // onRejected返回一个普通的值，失败时如果直接等于 value => value，
        // 则会跑到下一个then中的onFulfilled中，
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      };
    });
    return promise2;
  }
}
new Promise(resolve => {
    console.log(0)
    setTimeout(() => resolve(1), 3000)
  })
  .then(res => {
    console.log(res)
    return new Promise(resolve => {
      console.log(2)
      setTimeout(() => {
        resolve(3)
      }, 3000)
    })
  })
  .then(res => {
    console.log(res)
  })
```

###  5.  catch、resolve、reject、race和all 

####  1. catch(特殊的then方法)

```javascript
catch(fn){
    return this.then(null,fn)
}
```

#### 2. resolve(resolve一个值)

``` javascript
Promise.resolve = val => new Promise(resolve=> resolve(val))
```

#### 3. reject(reject一个值)

``` javascript
Promise.reject = val => new Promise((resolve,reject)=> reject(val))
```

#### 4. race

 Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态 。

``` javascript
Promise.race = promises =>
  new Promise((resolve, reject) =>
    promises.forEach(pro => pro.then(resolve, reject))
  )
```



#### 5. all

 Promise.all可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值。

``` javascript
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue(i, data) {
        result[i] = data;
        if (++index === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promises[i] 可能是普通值
        Promise.resolve(promises[i]).then((data) => {
          processValue(i, data);
        }, (err) => {
          reject(err);
          return;
        });
      }
    }
  });
}
```

本文旨在记录学习过程，通过手打代码加深印象，上面较难的代码参考了其他博客，可见

[Promise的源码实现（完美符合Promise/A+规范）]( https://juejin.im/post/5c88e427f265da2d8d6a1c84#heading-25 )

[BAT前端经典面试问题：史上最最最详细的手写Promise教程]( https://juejin.im/post/5b2f02cd5188252b937548ab )



