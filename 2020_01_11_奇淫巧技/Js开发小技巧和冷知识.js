//1. 区分对象和数组
;
(() => {
  console.log(Array.prototype.isPrototypeOf([])) // true //判断是否为原型
  console.log([] instanceof Array) // true
  console.log(Object.prototype.toString.call([])) //[object Array]
  console.log(Array.isArray([])) // true
})();

//2. function声明和变量声明的区别 
/**
 * function声明会在代码执行前就创建,初始化和赋值;
 * 变量声明函数则只做了变量声明的操作
 */

//3. let定义变量会提升吗?
/**
 * let a=1->变量创建,初始化和赋值过程
 * let 的「创建」过程被提升了，但是初始化没有提升。
 * var 的「创建」和「初始化」都被提升了。
 */
;
((window) => {
  Object.defineProperty(window, 'b', {
    value: 22
  });
  console.log(window.b) //22//此处不能直接打印b
  let b = 12
  console.log(b) //12
})(window);

//4. 事件传播流程
/**
 * 分为三个过程:捕获过程,目标过程,冒泡过程
 * IE只支持事件冒泡,不支持事件捕获
 * element.addEventListener('click',callback,是冒泡捕获),
 */

//5. 交换两个变量
;
(() => {
  let x = {
    a: 1
  }
  let y = {
    a: 2
  }
  console.log(x.a, y.a); // 1 2
  [x, y] = [y, x]
  console.log(x.a, y.a); // 2 1
})();

//6. 数组拼接
;
(() => {
  let a = [1, 2, 3]
  let b = [3, 4, 5]
  console.log(a)
  a.push(...b)
  console.log(a)
})();

//7. 数组去重
;
(() => {
  let obj1 = {
    a: 1
  }
  let obj2 = {
    a: 2
  }
  let obj3 = {
    a: 3
  }
  let obj4 = {
    a: 4
  }
  let obj5 = {
    a: 5
  }
  let a = [obj1, obj2, obj3]
  let b = [obj2, obj3, obj4, obj5]
  console.log(Array.from(new Set([...a, ...b])))
})();

//8. 缺省参数校验 类似于TS
;
(() => {
  function required() {
    throw new Error('Missing parameter')
  }

  function foo(p = require()) {
    console.log(p)
  }
  foo(1)
})();

//9. 数组复制
;
(() => {
  let arr = [1, 2, 3, 4]
  let [...arr1] = arr
  let arr2 = [...arr]
  arr1[0] = 10
  arr2[0] = 11
  console.log(arr, arr1, arr2)
})();

//10. 数组解构和赋值结合
;
(() => {
  let arr = [1, 2, 3, 4, 5]
  let a0 = arr[0]
  let arr1 = arr.slice(1)

  let brr = [1, 2, 3, 4, 5]
  let [b0, ...brr1] = brr
  console.log(a0, arr1)
  console.log(b0, brr1)
})();

//11.字符串转换为数组
;
(() => {
  let str = 'hellow world'
  console.log(str.split(''))
  console.log([...str])
})();

//12. 快速填充数组对象
;
(() => {
  let arr = new Array(5).fill('').map(item => ({}))
  arr[0].a = 1
  arr[1].b = 2
  console.log(arr)
})();

//13. 字符串首字符大小写
;
(() => {
  // 首字母大写
  String.prototype.firstLetter2UpperCase = function () {
    const [letter0, ...otherLetters] = [...this.valueOf()]
    return [letter0.toUpperCase(), ...otherLetters].join('')
  }
  // 首字母小写
  String.prototype.firstLetter2LowerCase = function () {
    const [letter0, ...otherLetters] = [...this.valueOf()]
    return [letter0.toLowerCase(), ...otherLetters].join('')
  }
  console.log('abcDef'.firstLetter2UpperCase())
  console.log('ABcDef'.firstLetter2LowerCase())
})();

//14. 对象属性抽取
;
(() => {
  Object.prototype.getNewObjectByKeys = function (keys = []) {
    const newObj = {}
    keys.forEach(key => newObj[key] = this[key])
    return newObj
  }
  const oldObj = {
    a: 1,
    b: 2,
    c: 3,
    d: {
      dd: 1
    }
  }
  console.log(oldObj.getNewObjectByKeys(['a', 'd']))
})();

//15. 设置默认值
;
(() => {
  const defaultObj = {
    x: 22,
    z: 33
  }
  const otherSetting = {
    x: 1,
    y: 2
  }
  const result = {
    ...otherSetting,
    ...defaultObj, // 默认值放在最后面
  }
  // or
  // const result = Object.assign({}, otherSetting, defaultObj)
  console.log(result === otherSetting, result)
})();

//16. 并集、交集和差集
;
(() => {
  const obj = {
    key: 'value'
  }
  const a = new Set([1, 2, 4, obj])
  const b = new Set([2, 3, 4, obj])

  // 并集
  const union = new Set([...a, ...b])
  // 交集
  const intersect = new Set([...a].filter(item => b.has(item)))
  // 差集
  const diffrence = new Set([...a].filter(item => !b.has(item)))
  console.log([...union])
  // [ 1, 2, 4, { key: 'value' }, 3 ]
  console.log([...intersect])
  // [ 2, 4, { key: 'value' } ]
  console.log([...diffrence])
  // [ 1 ]
})();

// 过滤掉假值
;
(() => {
  console.log([1, '', {
    a: 1
  }, undefined, {}, null, () => {}, 0, NaN].filter(Boolean))
})();

//17. 对象部分属性抽取：当一个对象的大部分数据要转移到另一个对象且key值保持一致时候可用
// 应用场景：Ajax发送到后端的数据只需要删除部分字段或者大部分字段可复用
;
(() => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
  }
  // bad 当key比较多的时候显得有点刻板
  const temp1 = {
    a: obj.a,
    b: obj.b,
    c: obj.c,
    d: obj.d
  }

  // good 适用大部分key保留
  const temp2 = JSON.parse(JSON.stringify(obj));
  ['e', 'f'].forEach(key => delete temp2[key]) // 大部分数据要转移到另一个对象且key值保持一致

  // good 适用抽取部分key
  const temp3 = {};
  ['a', 'b', 'c', 'd'].forEach(key => temp3[key] = obj[key])

  const postData = {
    ...temp2,
    other: 7
  }
  console.log(postData)
})();

/**
 * 18. 代理 Proxy：Vue错误提示、Vue3.0数据双向绑定实现原理（解决数组监听，vue实例创建后再添加字段的监听问题）
 * 代理还常常将复杂的功能，不想自己一步步完成的功能代理给专业完成该功能的第三方。
 * 与生活实际相结合，类似于买车代理各种手续
 * 类似于如下Demo，可以将数据校验的功能代理出去
 */
;
(() => {
  const CheckUtils = {
    moreThan0() { // 大于0
      return this.value > 0
    },
    lessThan100() { // 小于100
      return this.value < 100
    },
    // ... 可扩展其他校验
  }
  const checkHandle = { // 第三方
    get: function (target, name, recevier) {
      if (name === 'startCheck' && Array.isArray(target.rules)) {
        target.isError = !target.rules.every(key => (CheckUtils[key] instanceof Function) && (CheckUtils[key].call(target)))
      }
    }
  }
  const input = {
    isError: false,
    rules: ['moreThan0', 'lessThan100'],
    value: -1
  }
  const inputProxy = new Proxy(input, checkHandle) // 授予代理权
  console.log('before check', input.isError) // 校验前
  inputProxy.startCheck // 触发校验功能
  console.log('after check', input.isError) // 校验完成，查看校验结果
})();

// 
;
(() => {
  const nodes = [{
      name: 'nodeA',
      inputs: [{
        id: 'nodeAinput1',
        value: '$asdfas'
      }, {
        id: 'nodeAinput2',
        value: 'value'
      }]
    },
    {
      name: 'nodeB',
      inputs: [{
        id: 'nodeBinput1',
        value: '$asdfas'
      }, {
        id: 'nodeBinput2',
        value: 'value'
      }]
    },
  ]
  // 取到所有的inputs，便于统一处理，比如进行value的统一校验
  const allInputs = nodes.map(node => node.inputs).flat(Infinity)
  // 找到所有含'$'的input
  const errorInputs = allInputs.filter(input => input.value.includes('$'))
})();