(() => {
  function isUndefined(val) {
    return Object.prototype.toString.call(val).includes('Undefined')
  }

  function isArray(val) {
    return Object.prototype.toString.call(val).includes('Array')
  }

  function isObject(val) {
    return Object.prototype.toString.call(val).includes('Object')
  }

  function filterObjectByTemplate(data = {}, dataTemplate = {}) {
    const result = {}

    function _filterObjectByTemplate(obj, template, result) {
      Object.keys(template).forEach(key => {
        const nextTemplate = template[key]
        const nextObj = obj[key]
        if (isArray(nextTemplate)) {
          result[key] = []
          nextObj.forEach(item=>{

          })
          _filterObjectByTemplate(nextObj, nextTemplate, result[key])
        } else if (isObject(nextTemplate)) {
          result[key] = {}
          _filterObjectByTemplate(nextObj||{}, nextTemplate, result[key])
        } else {
          result[key] = nextObj
        }
      })
    }
    _filterObjectByTemplate(data, dataTemplate, result)
    return result
  }

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
    base:[1,2,3],
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
      type: '',
      id: ''
    }],
    base:[1]
  }
  console.log(filterObjectByTemplate(obj, saveTemplate))
})()