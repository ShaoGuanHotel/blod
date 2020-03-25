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

// 保存数据
const postData = {
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
// 后端保存接口模板
const saveTemplate = {
  name: '',
  objInfo: {
    key1: '',
    key2: '',
  },
  // 数组只需要配置一个templte
  inputs: [{
    value: '',
    id: ''
  }],
  base: [1]
}
const filterPostData = deepFilter(postData,saveTemplate)
/**
{
  name: 'su',
  objInfo: {
    key1: 'value1',
    key2: 'value2'
  },
  inputs: [{
      value: '1',
      id: 1
    },
    {
      value: '2',
      id: 2
    }],
  base: [1, 2, 3],
}
 */