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
console.log(deepClone({
  null: null,
  undef: undefined,
  fn() {},
  obj: {
    da: 1
  },
  nan: NaN,
  arr: [1, NaN, 2, undefined, 3, Symbol('aa'), 4, () => {}, 5, null, 6, , 7],
  symbol: Symbol('aa')
}))

const obj = {
  name: 'su',
  objInfo: {
    key1: 'value1',
    key2: 'value2',
    filterKey: 'filterKey value'
  },
  inputs: [{
      value: '1',
      type: 'input',
      id: 1
    },
    {
      value: '2',
      type: 'input',
      id: 2
    },
    {
      value: '3',
      type: 'input',
      id: 3
    },
  ],
  base: [1, 2, 3],
  filterKey: 'outside filter key value',
}
const obj2 = {
  name: 'su',
  objInfo: {
    key1: 'value1',
    key2: 'value2',
    filterKey: 'filterKey value'
  },
  inputs: [{
      value: '1',
      type: 'input', // 过滤数据
      id: 1
    },
    {
      value: '2',
      type: 'input',
      id: 2
    }],
  base: [1, 2, 3],
  filterKey: 'outside filter key value',
}
const saveTemplate = {
  name: '',
  objInfo: {
    key1: '',
    key2: '',
  },
  inputs: [{
    value: '',
    id: ''
  }],
  base: [1]
}

// const copy = deepClone(obj)
// console.log(copy)

function deepFilter(obj, template) {
  if (typeof obj !== 'object' || obj == null) return obj

  let result, newObj
  if (isArray(template)) {
    result = []
    newObj = []
    // 以template[0] 填充 模板
    template = new Array(obj.length).fill(template[0] || '')
  } else {
    newObj = {}
    result = {}
  }

  // 根据模板过滤属性
  Object.keys(template).forEach(key => {
    newObj[key] = template[key]
  })

  Object.keys(newObj).forEach(key => {
    result[key] = deepFilter(obj[key], template[key])
  })
  return result
}

// const filter = deepFilter(obj, saveTemplate)
// console.log(filter)

function deepCompare(obj1 = {}, obj2 = {}, template = obj1) {
  // 过滤掉不需要对比的字段
  const newObj1 = deepFilter(obj1, template)
  const newObj2 = deepFilter(obj2, template)
  console.log(newObj2)
  let isChange = false

  function _deepCompare(obj1 = {}, obj2 = {}) {
    if (typeof obj1 !== 'object' || obj1 == null) {
      if (obj1 !== obj2) { // 基本类型值不一致
        isChange = true
      }
    } else {
      // 数组长度不一样
      if (isArray(obj1) && (obj1.length !== obj2.length)) {
        isChange = true
      }
      Object.keys(obj1).forEach(key => {
        _deepCompare(obj1[key], obj2[key])
      })
    }
  }
  _deepCompare(newObj1, newObj2)
  return isChange
}
console.log(deepCompare(obj, obj2, saveTemplate))

(() => {
  function isArray(val) {
    return Object.prototype.toString.call(val).includes('Array')
  }
  // 浅拷贝的实现
  function shallowCopy(obj) {
    if (typeof obj !== 'object' || obj == null) return obj
    const result = isArray(obj) ? [] : {}
    Object.keys(obj).forEach(key => result[key] = obj[key])
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
    arr: [1, 2, 3]
  }
  const copyObj1 = Object.assign({}, obj)
  const copyObj2 = {
    ...obj
  }
  const copyObj3 = shallowCopy(obj)

  // 拷贝对象和被拷贝对象的引用类型的数据（`typeof obj === 'object'`）相等
  // Object Array Function
  copyObj1.arr === copyObj2.arr // true
  copyObj2.arr === copyObj3.arr // true
})()

(() => {
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
const copyObj = JSON.parse(JSON.stringify(obj))
/**
 * { 
    null: null,
    obj: { da: 1 },
    nan: null,
    arr: [ 1, null, 2, null, 3, null, 4, null, 5, null, 6, null, 7 ] 
  }
  */
})()