const queuedObserves = new Set()

function set(target, key, value, reciver) {
  const result = Reflect.set(target, key, value, reciver)
  queuedObserves.forEach((fn) => fn())
  return result
}
const observe = (fn) => queuedObserves.add(fn)
const observable = (obj) => new Proxy(obj, { set })

const person = observable({
  name: '张三',
  age: 20,
})
function print() {
  console.log(`${person.name}, ${person.age}`)
}
observe(print)
person.name = '李四'
