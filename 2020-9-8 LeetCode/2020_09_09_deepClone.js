function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) return obj
  const result = Array.isArray(obj) ? [] : {}

  // for (let key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     result[key] = deepClone(obj[key])
  //   }
  // }
  Object.entries(obj).forEach(([key, value]) => (result[key] = deepClone(value)))
  return result
}

var obj = {a:1,b:{c:2},fn(){console.log(this.a)}}
var clone = deepClone(obj)
clone.a = 2222
console.log(obj === clone)
console.log(obj.fn === clone.fn)
console.log(obj.b === clone.b)
obj.fn()
clone.fn()
