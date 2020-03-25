深系列操作在实际开发中用处十分大。下面列举它们常见的用途。

深拷贝：引用类型数据的备份；

深过滤：过滤多余的字段，保证发送到后端没有多余的字段；从大对象中提取数据；

深对比：识别用户有没有进行页面编辑，便于离开的时候进行提示：您已编辑数据，是否离开页面？

1. ### 深拷贝

   #### 浅拷贝

   说到深拷贝，顺便总结一下浅拷贝，浅拷贝只对第一层结构进行赋值拷贝，拷贝对象引用类型的数据（`typeof obj === 'object'`也就是`Object Array Function`）的数据和被拷贝对象的数据相等。浅拷贝不对数据进行过滤。

   ``` javascript
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
   const copyObj2 = { ...obj }
   const copyObj3 = shallowCopy(obj)
   
   // 拷贝对象和被拷贝对象的引用类型的数据（`typeof obj === 'object'`）相等
   // Object Array Function
   copyObj1.arr === copyObj2.arr // true
   copyObj2.arr === copyObj3.arr // true
   ```

   #### 迷你深拷贝

   实际开发过程中用我们常用的深拷贝是`JSON.parse(JSON.stringfy(obj))`。这种深拷贝有些缺点，会过滤掉不安全值：`undefined,function,symbol`;`NaN`替换为`null`。如果不安全值在数组中则会用`null`占位。

   ``` javascript
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
     { 
       null: null,
       obj: { da: 1 },
       nan: null,
       arr: [ 1, null, 2, null, 3, null, 4, null, 5, null, 6, null, 7 ] 
     }
    */
   ```

   #### 深拷贝实现

   ``` javascript
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
   obj.obj === copyObj.obj // fase
   obj.symbol === copyObj.symbol // true
   ```

   #### 注意事项

   不能进行循环引用数据的深拷贝。可以`try catch`一下

   ``` javascript
   const inner={
     b:2
   }
   const outer={
     a:1
   }
   outer.outerInner = inner
   inner.innerInner = outer
   // Uncaught TypeError: Converting circular structure to JSON
   JSON.parse(JSON.stringify(outer)) 
   // Maximum call stack size exceeded
   deepClone(outer)
   ```

2. ### 深过滤

   实际开发中我们保存到后端的复杂数据很大概率是由一些前端对象拼装组成，前端对象可能会添加一些前端使用的属性。现实中后端可能要求不能传递多余信息，也就是要删除多余字段。对于层级不深或者相对简单的数据我们可以用`delete`去删除。比如：

   ``` javascript
   const postData = {
     key1: 'value1',
     key2: 'value2',
     deleteKey1: '',
     deleteKey2: '',
     deleteKey3: '',
   };
   ['deleteKey1', 'deleteKey2', 'deleteKey3']
     .forEach(key => delete postData[key]);
   console.log(postData)
   // { key1: 'value1', key2: 'value2' }
   ```

   但是对于结构复杂和层次深的数据数据，上面的方法则显得乏力。因此我们需要__深过滤__来进行数据过滤。

   ``` javascript
   
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
   ```

3. ### 深对比

   对于输入较多的页面。固定弹出“您已编辑数据，确认离开？”询问，虽然能解决用户编辑了未保存离开页面的问题，但用户未曾编辑数据，点击离开固定弹出询问对用户不友好。于是我们需要深对比，对比编辑前`originData`和编辑后的数据`postData`是否相等，相等时用户离开放行，不相等时用户离开进行拦截询问。那么需要深对比。

   #### 迷你深对比

   对于简单的场景，所有的数据需要对比，可以采用如下方式：

   ``` javascript
   const isChange = JSON.parse(JSON.stringify(originData) 
                !== JSON.parse(JSON.stringify(postData))
   ```

   #### 选择深对比

   对于保存数据复杂且含有不需要对比数据的场景，可以先进行深过滤，再进行深对比：

   ``` javascript
   /**
    * 深对比
    * @param {Object} obj1 对比对象1
    * @param {Object} obj2 对比对象2
    * @param {Object} template 过滤模板 可选
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
   ```

   