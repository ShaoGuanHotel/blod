function spawn(genFn) {
  return new Promise((resolve, reject) => {
    const gen = genFn()
    const step = (nextFn) => {
      let next
      try {
        next = nextFn()
      } catch (error) {
        return reject(error)
      }
      if (next.done) {
        return resolve(next.value)
      }
      Promise.resolve(next.value).then(
        (v) => step(() => gen.next(v)),
        (e) => step(() => gen.throw(e))
      )
    }
    step(() => gen.next())
  })
}

// 模拟api
const newAPI = (value, time) =>
  new Promise((resolve, reject) => {
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

function* testG() {
  const data1 = yield newAPI(1, 1)
  console.log(1111, data1)
  const data2 = yield newAPI(2, 2)
  console.log(222, data2)
  return data1 + data2
}

spawn(testG).then((res) => console.log(res))
