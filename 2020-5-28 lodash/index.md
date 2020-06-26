## [Lodash](https://www.lodashjs.com/)那些“多余”和让人眼前一亮的 API

### 一、收获

1. lodash那些功能强大的API
2. lodash那些“多余”的API及原生JS对应写法

### 二、 Lodash

​	[Lodash]( https://www.lodashjs.com/ ) 是一个一致性、模块化、高性能的 JavaScript 实用工具库。采用函数类API，多数API都不修改传入的参数。

​	Lodash功能强大，涵盖了前端开发中能遇到的大部分逻辑功能点，使用Lodash能大大提高我们的开发效率。但这也有一个弊端：便利往往会使我们变"懒"。仁者见仁智者见智，Lodash带来便利同时，我们应该时刻记住：JavaScript才是我们的根本。

​	Lodash，[gitHub]( https://github.com/lodash/lodash ) star数为45K。同时是一个学习教材，通过阅读源码能帮助我们夯实JavaScript基础。函数式API让每个逻辑功能点代码量不大，比较容易理解。基础差的同学可以通过阅读源码，手写源码的方式来夯实JavaScript，比如手写：柯里化，防抖，节流，bind，字符转template等。

### 三、数组 Array

#### “多余”指数：☆☆

1. compact（过滤假值）

``` javascript
   lodash.compact([0, 1, false, 2, '', 3])
   [0, 1, false, 2, '', 3].filter(_ => _)
   // [1, 2, 3]
```


2. concat（数组拼接）

``` javascript
   lodash.concat([1], [2, 3, 4], [5, 6])
   [1, ...[2, 3, 4], ...[5, 6]]
   // [1, 2, 3, 4, 5, 6]
```

3. fill（填充）

``` javascript
   lodash.fill([1,2,3],'a')
   [1,2,3].fill('a'))
   // ['a', 'a', 'a']
   
   lodash.fill(Array(3),'b')
   Array(3).fill('b')
   // ['b', 'b', 'b']
```

4. head（获取第一个元素）

``` javascript
   const first1 = lodash.head([1, 2, 3])
   const [first2] = [1, 2, 3]
   // 1
```

5. flatten（降1个维度）

``` javascript
   lodash.flatten([1, [2, [3, [4]], 5]]))
   [1, [2, [3, [4]], 5]].flat(1))
   // [1, 2, [3, [4]], 5]
```

6. flattenDeep | flattenDepth（降为一维数组）

``` javascript
   lodash.flattenDeep([1, [2, [3, [4]], 5]])
   lodash.flattenDepth([1, [2, [3, [4]], 5]], 3)
   [1, [2, [3, [4]], 5]].flat(Infinity)
   // [1, 2, 3, 4, 5]
```

7. fromPairs（entries类型数组转换为对象）

``` javascript
   lodash.fromPairs([['fred', 30], ['barney', 40]])
   Object.fromEntries([['fred', 30], ['barney', 40]])
   // {fred: 30, barney: 40}
```

8. pull（溢出给定元素）

``` javascript
   lodash.pull([1, 2, 3, 1, 2, 3], 2, 3)
   [1, 2, 3, 1, 2, 3].filter(item => ![2, 3].includes(item))
   // [1, 1]
```

9.  Array自带的reverse （数组翻转）、slice（切割）、join（字符串拼接）、indexOf | lastIndexOf（匹配索引）等

#### “多余”指数：☆

1. difference

``` javascript
   lodash.difference([3, 2, 1], [4, 2])
   [3, 2, 1].filter(item => ![4, 2].includes(item))
```

2. tail（返回不包含第一个元素的数组）

``` javascript
   var other = lodash.tail([1, 2, 3])
   var [, ...other] = [1, 2, 3] // 可扩展不包含前第n个元素
```

3.  take （0 - n的元素），如果用于删除数组元素有点"多余"

``` javascript
   let arr1 = [1, 2, 3, 4, 5]
   arr1 = lodash.take(arr1, 2) // 做赋值，删除元素
   const arr2 = [1, 2, 3, 4, 5]
   arr2.length = 2 // 修改长度，直接删除后面元素，可用于清空数组
   // [1, 2]
```


#### 眼前一亮的API

1.  pullAt （根据下标选择元素，分到两个数组）

2.  takeRight （ 返回从结尾元素开始n个元素的数组切片 ）

``` javascript
   // 倒数解构
   const [beforeLast, last] = lodash.takeRight([1, 2, 3, 4], 2)
   console.log(beforeLast, last) // 3 4
```
3.  zipObject 

``` javascript
   lodash.zipObject(['a', 'b'], [1, 2]);
   // => { 'a': 1, 'b': 2 }
```

4.  zipObjectDeep 

``` javascript
   lodash.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
   // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
```

5. xor（ 创建一个给定数组唯一值的数组 ）

#### 眼前二亮的API

1. remove（元素筛选，分到两个数组）

2.  sortedUniq （去重，排序）

3.  takeRightWhile （ 从`array`数组的最后一个元素开始提取元素，直到 `predicate` 返回假值 ）

4.  uniqBy （去重，排序）

### 四、集合 Collection

​	Collection很多API都能让人眼前一亮，在实际开发中都能得到应用。

1. forEach（遍历数组或对象） | forEachRight（反序遍历数组或对象）

``` javascript
   // 遍历数组有点多余
   lodash([1, 2]).forEach((val) => {
     console.log(val)
   })
   // 遍历对象就
   lodash({ a: 1, b: 2 }).forEach((val, key) => {
     console.log(val, key)
   })
   // 原生js写法                      **** 注意数组解构顺序
   Object.entries({ a: 1, b: 2 }).forEach(([key, val]) => {
     console.log(val, key)
   })
```

2. every（每个元素都符合条件）| some（某个元素符合条件）| filter（过滤）| find（查找第一个）| findLast（查找最后一个）| includes（抱哈某个元素）。亮点：可以传入一个对象进行匹配

``` javascript
   console.log(lodash([true, 1, null, 'yes']).every(Boolean)) // false
   // 等效于
   console.log([true, 1, null, 'yes'].every(Boolean)) // false
   
   const users = [
       { user: 'barney', age: 40, active: false },
       { user: 'fred', age: 40, active: false },
   ]
   
   // *******眼前一亮的用法********
   console.log(lodash(users).every({ active: false, age: 40 })) // true
   // 等效于
   console.log(users.every((item) => item.active === false && item.age === 40)) // true
   
   console.log(lodash.find(users, { user: 'fred' }) === users[1]) // true
   console.log(lodash.filter(users, { user: 'fred' })) // object for ['fred']
   console.log(lodash.some(users, { user: 'fred' })) // true
```

3. groupBy（分组）

``` javascript
   const users = [
       { id: 'a', age: 40, height: 1 },
       { id: 'b', age: 39, height: 2 },
       { id: 'c', age: 38, height: 2 },
       { id: 'd', age: 40, height: 2 },
   ]
   console.log(lodash.groupBy(users, 'age'))
   // 按age分组:{38:obj for ['a'], 39:obj for ['b'], 40:obj for ['c', 'd']}
   console.log(lodash.groupBy(users, ({ age, height }) => age + height))
   // 按age+height结果分组:{40:obj for ['c'], 41:obj for ['a', 'b'], 42:obj for ['d']}
```

4.  invokeMap （分解item：循环调用方法，方法返回值替换集合item）

5.  keyBy （ 生成对象：组成聚合的对象 ；key值来源于回调，回调参数为对应集合item；value为item）

6.  orderBy | sortBy（排序：可指定多个排序字段，有优先级；可控制升序和反序）

7.  partition （站队：根据回调返回值，返回 [ 返回值为true的item数组 , 返回值为false的item数组]）

8.  reject （找茬：找出不符合条件的item集合，类似！filter）

9.  sample （抽签：集合中随机取一个）

10.  sampleSize （抽签：集合随机抽取n个）

11.  shuffle （打乱）

### 五、函数 Function

​	下面列举的是实际开发中应用场景较多的API，具体的用法就不做demo了，具体可参看官网API。

1.  after(n, func)  ：调用执行n次后才能执行func
2.  before(n, func)：调用n次后不再执行func，n次后的返回值为第n次返回值
3.  curry  |  curryRight ：柯里化
4.  debounce ：防抖
5.  defer ： 推迟调用`func`，直到当前堆栈清理完毕 
6.  throttle ：节流
7.  unary ： 创建一个最多接受一个参数的函数，忽略多余的参数 

### 六、Lang

​	Lang下多为判断类型的API，常规的isXxx判断类型API就不做过多的介绍。下面介绍一些好用的API。

1.  克隆系列：clone、cloneDeep、cloneWith、cloneDeepWith
2.  eq ：判断相等，能判断NaN
3.  isEqual ：判断两个对象可枚举value相等，注意不能用于对比DOM对象
4.  isEqualWith：定制isEqual比较
5.  isMatch ：判断两个对象部分可枚举value相等
6.  isMatchWith ：定制isMatch比较

### 七、数学 Math

​	maxBy（最大值） | minBy（最小值）|  meanBy （求平局值）|  sumBy （求和）

``` javascript
const users = [
    { id: 'b', age: 39, height: 2 },
    { id: 'a', age: 40, height: 1 },
    { id: 'c', age: 38, height: 2 },
    { id: 'd', age: 40, height: 2 },
]
console.log(lodash.maxBy(users, 'age'))
// obj for 'a'
console.log(lodash.maxBy(users, ({ age, height }) => age + height))
// obj for 'd'
```

### 八、数字 Number

1. inRange：判断大于等于且小于等于。改进实现isInRange

``` javascript
   /**
    * 判断数字是否在某个区间
    * @param string 范围
    * demo：
    * const ten = 10
    * ten.isInRange('[1,10]') // true
    * ten.isInRange('[1,10)') // false
    */
   Number.prototype.isInRange = function (range = '[1,10]') {
     // 1. 应该对range进行正则校验
     const val = this.valueOf()
     const isStartEqual = range.startsWith('[')
     const isEndEqual = range.endsWith(']')
   
     let [start, end] = range
       .slice(1, range.length - 1) // 去头尾符号 '1,10'
       .split(',') // 切割字符串 ['1', '10']
       .map(Number) // 转换数字 [1, 10]
   
     start > end && ([start, end] = [end, start]) // 保证start < end
   
     const isGt = isStartEqual ? val >= start : val > start // >start
     const isLt = isEndEqual ? val <= end : val < end // <end
     return isGt && isLt
   }
   const ten = 10
   console.log(ten.isInRange('[1,10]')) // true
   console.log(ten.isInRange('[1,10)')) // false
```

### 九、对象 Object

​	下面只记录让人眼前一亮的API

1.  at  |  get ：字符串key链路取值

``` javascript
   const object = { a: [{ b: { c: 3 } }, 4] }
   console.log(lodash.at(object, ['a[0].b.c', 'a[1]']))
   // [3, 4]
   console.log(lodash.at(object, 'a[0].b.c'))
   // [3]
   console.log(lodash.get(object, 'a[0].b.c'))
   // 3
```

2.  defaultsDeep ：深层设置默认值

``` javascript
   const defaultData = { a: { b: 1, c: 3 } } // 默认值
   const settingData = { a: { b: 2 } } // 设置的值
   
   // 当对象只有一层的时候对象结构还挺好用，类似于lodash.defaults
   // 当对象层级不止一层的时候，层级深的默认值就被冲刷掉了
   const mergeData = {
       ...defaultData, // 默认值放在前面
       ...settingData,
   }
   console.log(mergeData)
   // {a:{b:2}}
   
   // 会改变settingData,所以取副本
   const mergeDataGood = JSON.parse(JSON.stringify(settingData))
   lodash.defaultsDeep(mergeDataGood, defaultData) // 默认值在最后
   console.log(mergeDataGood)
   // {a:{b: 2, c: 3}}
```

3. has |  hasIn ： 判断是否有属性链。有时候为了避免代码报错，需要进行串联取值：`const dValue = a&&a.b&&a.b.c&&a.b.c.d`。`ES2020`已定稿增加了操作符：`?.`来解决上述问题。上面等价写法为：`const dValue = a?.b?.c?.d`

``` javascript
   const obj = { a: { b: { c: { d: 'dValue' } } } }
   const obj2 = {}
   console.log(lodash.has(obj,'a.b.c.d')) // true
   console.log(lodash.has(obj2,'a.b.c.d')) // false
```

4. invert ： key-value反转，返回新对象，新对象为旧对象的value-key；

5. invertBy ：类似invert，能对新对象的key进行处理；

6. mapKeys ：处理对象的key，生成新对象；

7. mapValues ：处理对象value，生成新对象；

8. merge |  mergeWith ：对象合并

``` javascript
   var object = {
       a: [{ b: 2 }, { d: 4 }],
       obj: { key1: 'value1', key2: 'value2' },
   }
   var other = {
       a: [{ c: 3 }, { e: 5 }],
       obj: { key1: 'valueOther1', key3: 'valueOther2' },
   }
   console.log(lodash.merge(object, other))
   /**
   {
     a: [
         { b: 2, c: 3 },
         { d: 4, e: 5 },
     ],
     obj: { key1: 'valueOther1', key2: 'value2', key3: 'valueOther2' },
   }
   */
```

9. omit |  omitBy ：剔除对象属性。用在抽取保存到后端数据，后端校验严格，不能有多余字段等场景。

``` javascript
   const model = {
       key1: 'value1', // 需要发送到后端的数据
       key2: 'value2',
       key3: 'value3',
       pageKey1: 'pageValue1', // 页面用到的字段
       pageKey2: 'pageValue2',
       pageKey3: 'pageValue3',
   }
   // 1. 原始写法
   const postData1 = {
       key1: model.key1,
       key2: model.key2,
       key3: model.key3,
   }
   // omit
   const postData2 = lodash.omit(model, ['pageKey1', 'pageKey2', 'pageKey3'])
   
   // omitBy                                               // 剔除key包含page字段
   const postData3 = lodash.omitBy(model, (value, key) => key.includes('page'))
   
   console.log(lodash.isEqual(postData1, postData2)) // true
   console.log(lodash.isEqual(postData1, postData3)) // true
```

10. pick | pickBy：摘选对象属性，功能和omit |  omitBy 相反。当要剔除的属性比保留属性多的时候采用pick

11. set：字符串key链路设置值，和get对应

### 十、Seq

​	API过多，下面只记录Seq让人眼前一亮的API

1.  chain ：解决lodash不能链式调用

``` javascript
   var users = [
       { user: 'barney', age: 36 },
       { user: 'fred', age: 40 },
       { user: 'pebbles', age: 1 },
   ]
   const first = lodash
       .chain(users)
       .sortBy('age')
       .map(function (o) {
           return o.user + ' is ' + o.age
       })
       .head()
       .value() // 注意这里要运行.value()才运行，得到结果
   console.log(first) // pebbles is 1
```

### 十一、字符串 String

​	lodash的String API多为转换不同值的API，如：首字母大写、驼峰式、html属性式、下划线连接式、全小写、首字母小写、编码、填充，去空格等API。

​	唯一亮眼的API：template（字符串模板）。可应用于 [动态国际化、拼接国际化较优实现]( https://juejin.im/post/5e172e95e51d453095284a82 )

``` javascript
const compiled = lodash.template('hello <%= user.name %>!')
console.log(compiled({ user: { name: 'fred' } }))
// hello fred!
```

