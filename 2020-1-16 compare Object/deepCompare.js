function isArray(val) {
  return Object.prototype.toString.call(val).includes('Array')
}
/**
 * 深过滤
 * @param {Object} obj 过滤的对象
 * @param {Object} template 过滤模板
 */
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
/**
 * 深对比
 * @param {Object} obj1 对比对象1
 * @param {Object} obj2 对比对象2
 * @param {Object} template 过滤模板
 */
function deepCompare(obj1 = {}, obj2 = {}, template = obj1) {
  // 过滤掉不需要对比的字段，不需要对比的字段不影响对比结果
  const newObj1 = deepFilter(obj1, template)
  const newObj2 = deepFilter(obj2, template)
  let isChange = false // 对象是否修改

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

// 编辑页面前缓存的数据
const originData = {
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
    }
  ],
  base: [1, 2, 3],
  filterKey: 'outside filter key value',
}
// 对比模板
const compareTemplate = {
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

// 未修改对比
var postData = JSON.parse(JSON.stringify(originData))
var isChange = deepCompare(originData, postData, compareTemplate)
console.log(isChange) // false

// 删除数据后对比
var postData = JSON.parse(JSON.stringify(originData))
postData.inputs.length = 1 // 删除了一个数据
var isChange = deepCompare(originData, postData, compareTemplate)
console.log(isChange) //true 

// 编辑数据后对比
var postData = JSON.parse(JSON.stringify(originData))
postData.inputs[0].value = 'changeValue'
var isChange = deepCompare(originData, postData, compareTemplate)
console.log(isChange) // true