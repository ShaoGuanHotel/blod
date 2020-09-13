function isArray(val) {
  return Object.prototype.toString.call(val).includes('Array')
}

function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) return obj
  const result = isArray(obj) ? [] : {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  return result
}
const obj = {
  null: null,
  undef: undefined,
  fn() {},
  obj: {
    da: 1
  },
  nan: NaN,
  arr: [1, NaN, 2, undefined, 3, Symbol('aa'), 4, () => {}, 5, null, 6, , 7],
  symbol: Symbol('aa')
}
const copyObj = deepClone(obj)
/**
{
  null: null,
  undef: undefined,
  fn() {},
  obj: {
    da: 1
  },
  nan: NaN,
  arr: [1, NaN, 2, undefined, 3, Symbol('aa'), 4, () => {}, 5, null, 6, , 7],
  symbol: Symbol('aa')
}
 */
obj.fn === copyObj.fn // true 注意函数不进行深拷贝
obj.obj === copyObj.obj // false
obj.symbol === copyObj.symbol // false

const inner={
  b:2
}
const outer={
  a:1
}
outer.outerInner = inner
inner.innerInner = outer

try{
  JSON.parse(JSON.stringify(outer))
}catch(e){
  
}