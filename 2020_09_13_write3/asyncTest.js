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
console.log(testG.constructor.name)

const gen = testG()
console.log(gen.next().value.then((res) => console.log('aaaaaaaaaaaaaaa', res)))
console.log(gen.next())
console.log(gen.next())

async function test() {
  return 1/0
}
console.log(
  test().then(
    (res) => console.log(res),
    (error) => console.log('eee',error)
  )
)
