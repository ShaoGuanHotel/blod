### 背景

	最近项目组重构一个大型项目，为了引领时尚潮流，做公司最靓的仔。项目前端组采用`Vue3.0`进行重构。


![](https://user-gold-cdn.xitu.io/2020/4/20/17193b6ee9b8615c?w=170&h=184&f=jpeg&s=6303)

	当然，他们没有强制要求使用`Vue3.0`，不习惯的依然采用`Vue2.x`的写法慢慢过渡。我个人喜欢追求新知识，所以我就一步到位了。`Vue3.0`的升级必然有许多亮点，之前也有大致了解：函数式API，Typescript支持等。最喜欢这种工作，可以在工作尝试和学习新的东西。从此开始`Vue3.0`之旅。
	
	初看[composition-api](https://github.com/vuejs/composition-api) ，我的表情如下：


![](https://user-gold-cdn.xitu.io/2020/4/20/17193b71620cc2a1?w=210&h=211&f=jpeg&s=10671)

	这不就是`React`的`Hook`吗？ 也关注了一下网上同行的评价，许多`React`的开发者对这次的升级表示不屑，这不就是抄袭吗？由于`Vue`入门简单，拥有丰富的UI库，庞大的使用人群，良好的生态系统，成为了当下火热的前端框架。如今`Vue`的star数`162K`，React的star数为`147K`。Vue“抄袭”`React`的`Hook`也能理解，既然有巨人的肩膀，为何`Vue`不站上去呢。我们不能做一个随波逐流的人，独立思考了一下，引用最近比较火的一句话：“存在即合理”。个人觉得`Vue`此次升级的主要是为了解决：

1. `Typescript`是大趋势，[TypeScript安利指南]( https://juejin.im/post/5d8efeace51d45782b0c1bd6 )。`Vue2.x`对`Typescript`支持度不高；
2. 代码复用：`Vue2.x`可以通过`mixins`（类似多继承）和`extends`（类似单继承）来实现，存在命名冲突，隐藏复用`API`等缺点；`Vue3.0`采用函数编程便能很好的解决代码复用问题。

### 1 主要升级了什么?
下面介绍的是对于我们开发者比较容易感知的一些优化，至于重写虚拟节点，提高运行时效率等优化暂时还没有深入研究。

#### 1.1 双向绑定

#### vue2.x双向绑定

	众所周知，`Vue2.x`双向绑定通过`Object. defineproperty `重定义`data`中的属性的`get`和`set`方法，从而劫持了`data`的`get`和`set`操作。`Vue2.x`双向绑定存在的弊端有：

1.  实例创建后添加的属性监听不到，因为数据劫持是在实例初始化过程中执行，具体是在`beforeCreate`和`created`生命周期间完成。可以通过`$set`来解决后期添加监听属性的问题。
2. `defineproperty ()`无法监听数组变化，当直接用`index`设置数组项是不会被检测到的。如：`this.showData[1] = {a:1}`。当然也能用$set解决。官方文档指出，通过下面八种方法操作数组，`Vue`能检测到数据变化，分别为：`push()、pop()、shift()、unshift()、splice()、sort()、reverse()`

#### vue3.0双向绑定

	`Vue3.0`采用Proxy和Reflect实现双向绑定， 它在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。我们可以这样认为，`Proxy`是`Object.defineProperty`的全方位加强版。

 `Object.defineProperty`能做的`Proxy`能做


![](https://user-gold-cdn.xitu.io/2020/4/20/17193b7968bc47c2?w=260&h=150&f=jpeg&s=12498)

`Proxy`有多达13种拦截方法,不限于`apply、ownKeys、deleteProperty、has`等等是`Object.defineProperty`不具备的。`Object.defineProperty`不能做的Proxy还能做。 


![](https://user-gold-cdn.xitu.io/2020/4/20/17193b7d2590bc75?w=260&h=150&f=jpeg&s=12551)

`Proxy`作为新标准，得到了各大浏览器厂商的大力支持，性能持续优化。唯一的不足就是兼容性的问题，而且无法通过`polyfill`解决。

更多详细内容见：[面试官: 实现双向绑定Proxy比defineproperty优劣如何?]( https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf )

顺便感慨一下：掘金个个都是人才，说话又好听，噢哟超喜欢在里面！像在外面开厢一样，high到那种感觉，飞起来那种感觉 。不像某CSDN，帖子抄来抄去，还占据了大量的搜索资源。


![](https://user-gold-cdn.xitu.io/2020/4/20/17193b98de1af56e?w=251&h=160&f=jpeg&s=8742)

#### 1.2 函数式API

	函数式`API`主要是为了解决代码复用以及对Typescript的友善支持。这里主要介绍代码复用的升级。废话不多说，直接撸代码。下面介绍的场景相对简单，应该也比较好理解，是我们平时开发过程中常用的搜索组件。

代码结构如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193ba12d6b35c2?w=264&h=137&f=png&s=4592)

初始化效果：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193ba84ad8fe08?w=783&h=288&f=png&s=15381)

#### vue2.x代码复用

```vue
<template>
  <div class="vue2">
    <el-input type="text" @change="onSearch" v-model="searchValue" />
    <div v-for="name in names" v-show="name.isFixSearch" :key="name.id">
      {{ name.value }}
    </div>
  </div>
</template>
<script>
 // vue2.vue
import searchMixin from "./searchMixin";
export default {
  mixins: [searchMixin],
  data() {
    return {
      names: [
        { id: 1, isFixSearch: true, value: "name1" },
        { id: 2, isFixSearch: true, value: "name2" },
        { id: 3, isFixSearch: true, value: "name3" },
        { id: 4, isFixSearch: true, value: "name4" },
        { id: 5, isFixSearch: true, value: "name5" },
      ],
    };
  },
};
</script>
<style lang="less">
.vue2 {
}
</style>
```


```javascript
// searchMixin.js
export default {
  data() {
    return {
      searchValue: ''
    }
  },
  /**
   * 命名固定，外面另外命名不容易
   * 应该可以通过 searchMixin.methods.onNewNameSearch =  searchMixin.methods.onSearch
   * 来进行重命名。但是data里面的应该就重命名不了了。
   */
  methods: {
    onSearch() { 
      this.names
          .forEach(name => 
             name.isFixSearch = name.value.includes(this.searchValue)
           )
    }
  }
}
```

效果如下：
![](https://user-gold-cdn.xitu.io/2020/4/20/17193baff6778e0c?w=328&h=229&f=png&s=5011)
#### 缺点：

1. 命名容易冲突，容易覆盖引入`mixin`的页面属性；
2. 问题追踪难度大，这个缺点还是由于名称冲突导致的。`mixin`多的话容易出现不容易定位的问题。当然也可以通过`namespace`来解决。

#### vue3.0代码复用

``` vue

<template>
  <div class="vue3">
    <el-input type="text" @change="onSearch" v-model="searchValue" />
    <div v-for="name in names" v-show="name.isFixSearch" :key="name.id">
      {{ name.value }}
    </div>
  </div>
</template>
<script>
 // vue3
import useSearch from "./useSearch";
export default {
  setup() {
    const originNames = [
      { id: 1, isFixSearch: true, value: "name1" },
      { id: 2, isFixSearch: true, value: "name2" },
      { id: 3, isFixSearch: true, value: "name3" },
      { id: 4, isFixSearch: true, value: "name4" },
      { id: 5, isFixSearch: true, value: "name5" },
    ];
    // 				可以很容易重命名
    const { onSearch, data: names, searchValue } = useSearch(originNames);
    return {
      onSearch,
      names,
      searchValue,
    };
  },
};
</script>
<style lang="less">
.vue3 {
}
</style>
```

```javascript
// useSearch
import {
  reactive,
  toRefs
} from "@vue/composition-api";
export default function useSearch(names) {
  const state = reactive({
    data: names,
    searchValue: ''
  })
  const onSearch = () => {
    state.data.forEach(name => 
      name.isFixSearch = name.value.includes(state.searchValue)
    )
  }

  return {
    ...toRefs(state),
    onSearch
  }
}
```

效果如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193bba257687a8?w=305&h=132&f=png&s=2821)

#### 缺点：暂无

#### 1.3 Typescript支持

#### vue2.x Typescript支持

一开始的`vue2.x`是不支持`Typescript`的，耐不住`Typescript`的火热，就出现了`.vue`中`class`写法，通过[vue-class-component]( https://github.com/vuejs/vue-class-component )强行支持`Typescript`。且看下面代码。

```vue
<template>
  <div>
    <input v-model="hello" />
    <p>hello: {{ hello }}</p>
    <p>computed: {{ computedMsg }}</p>
    <button @click="greet({a:1})">Hello TS</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

@Component
class MixinsDemo extends Vue {
  typescript = "Typescript";
}
// 这里便可以使用Typescript的类型检验了
function testTs(val: string) {
  console.log("testTs");
}
// 编译失败
testTs('1')

@Component
export default class TS extends mixins(MixinsDemo) {
  // 初始化数据
  hello = "Hello";
  // 声明周期钩子
  mounted() {}
  // 计算属性
  get computedMsg() {
    return `computed ${this.hello} ${this.typescript}`;
  }
  // template 传参校类型验不了
  greet(val: string) {
    alert(`greeting ${this.hello} ${this.typescript}-${val}`);
  }
}
</script>

```

#### 缺点：

1. 在`Vue2.x`语法外还要重新学习一套语法
2. 代码复用的问题没有得到根本的解决

效果如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193bc055bb4fd8?w=623&h=227&f=png&s=15105)

`Vue2.x1`引入`Typescript`意犹未尽的可以查看：[在 Vue 中使用 TypeScript 的一些思考（实践）]( https://juejin.im/post/5b3d4135e51d4519962e7a1e )

#### Vue3.0 Typescript支持

由于`Vue3.0`采用函数式`API`开发，能很方便的引入`Typescript`，这里就不赘述了。

### 2 新写法和旧写法对比

	上面啰嗦了那么多“废话”，下面就开启`Vue3.0`之旅。首先简单介绍一下`Vue3.0`入口`API setup(props,ctx)`的两个参数：

1. props：`template`传递的参数，不像`vue2.x`可以通过`this.propsA`访问到`template`传递的参数，这里要通过`props.propsA`进行访问
2. ctx：上下文，`setup`里面`this`不再指向`vue`实例，`ctx`有几个属性：`slots, root, parent, refs, attrs, listeners, isServer, ssrContext, emit`，其中`root`指向`vue实例，其他详细介绍可见[Vue Composition API]( https://composition-api.vuejs.org )

下面内容是`Vue2.x`常用的场景写法映射到`Vue3.0`，希望在你日常开发过程中有所帮助。代码目录结构如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193bc60410602e?w=266&h=85&f=png&s=2503)

页面效果如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193c0662854af7?w=1141&h=308&f=png&s=33263)

#### 2.1 双向绑定

#### Vue2.x双向绑定

``` js
export default {
  data() {
    return {
      plusValue: 1,
      stateValue: 1,
    };
  },
  created(){
    // 单向绑定
    this.singleValue = 2
  },
  methods: {
    onClickSingle() {
      this.singleValue++;
      console.log(this.singleValue);
    },
    onPlus() {
      this.plusValue++;
    },
    onPlueState() {
      this.stateValue++;
    },
  },
};
```

#### Vue3.0双向绑定

	双向绑定个人更喜欢通过`reactive`统一包裹，访问的时候可以通过`state.stateValue`进行访问和赋值，通过ref生成的双向绑定数据需要通过`plusValue.value`的形式进行访问和赋值。而且可以通过`...toRefs(state)`一次性解构为双向绑定的属性。

``` javascript
import { reactive, ref, toRefs } from "@vue/composition-api";

export default {
  setup() {
    // 单向绑定
    let singleValue = 2;
    // 单个双向绑定
    const plusValue = ref(1);
    // 对象包裹双向绑定
    const state = reactive({
      stateValue: 1,
    });

    const methods = {
      onClickSingle() {
        singleValue++;
        console.log(singleValue);
      },
      onPlus() {
        plusValue.value++;
      },
      onPlueState() {
        state.stateValue++;
      },
    };
    return {
      ...toRefs(state),
      plusValue,
      singleValue,
      ...methods,
    };
  },
};
```

#### 2.2 computed

#### Vue2.x computed

``` vue
computed: {
    plusValueAndStateValue() {
      return this.plusValue + this.stateValue;
    },
 },
```

#### Vue3.0 computed

``` javascript
import { computed } from "@vue/composition-api";
// 计算属性
const plusValueAndStateValue = computed(
    () => plusValue.value + state.stateValue
);
```

#### 2.3 watch

#### Vue2.x watch

``` vue
watch: {
    plusValueAndStateValue(val) {
      console.log("vue2 watch plusValueAndStateValue change", val);
    },
  },
```

#### Vue3.0 watch

``` javascript
import { watch } from "@vue/composition-api";
watch(plusValueAndStateValue, (val) => {
      console.log("vue3 watch plusValueAndStateValue change", val);
});
```

#### 2.4 eventBus

#### Vue2.x eventBus

`Vue2.x`可以通过`App.vue`实例来跨组件广播事件，传递数据。

``` vue
onClickSingle() {
      this.singleValue++;
	  // 广播事件
      this.$root.$emit("vue2 eventBus", { a: 1 });
      console.log(this.singleValue);
},
```

另一个存活的`vue`实例，接受事件

``` vue
created() {
    this.$root.$on("vue2 eventBus", (data) => {
      console.log(data);
      debugger;
    });
  },
```

当然也可以通过监听`vuex`中的属性值来实现`eventBus`。参看[状态机Vuex的奇淫巧技-多弹框、多事件统一控制]( https://juejin.im/post/5e1b1802f265da3df716d5eb )

#### Vue3.0 eventBus

发送事件（原理和`vue2.x`一样）

``` javascript
onClickSingle() {
    singleValue++;
    ctx.root.$root.$emit("vue3 eventBus", { a: 3 });
    console.log(singleValue);
}
```

接受事件

``` javascript
ctx.root.$root.$on("vue3 eventBus", (data) => {
    console.log(data);
    debugger;
});
```

当然也可以通过`Vue3.0`中`vuex`代替方案中监听注入属性来实现`eventBus`，见下面`2.6`

#### 2.5 生命周期

`Vue3.0`中不再存在`beforeCreate`和`created`。`composition-api`暴露其他生命周期的`API`，都是以on开头的`API`。下面就`mounted`写法进行举例，其他生命周期类比。

```javascript
import { 
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onUnmounted,
    onUpdated,
} from "@vue/composition-api";
export default {
  setup(props, ctx) {
    onMounted(()=>{
        console.log('mounted')
    })
  },
};
```

#### 2.6 vuex

`Vue2.x vuex`的写法可参看[状态机Vuex的奇淫巧技-多弹框、多事件统一控制]( https://juejin.im/post/5e1b1802f265da3df716d5eb )。由于`Vue3.0`不能直接访问到this，不能方便的调用`this.$commit`；也不方便通过`mapState`在`computed`注入属性。`composition-api`提供了两个API：`provide、inject`。让`Vue`更加`React`，通过这两个`API`可以替代`vuex`进行状态管理。

代码结构如下：

![](https://user-gold-cdn.xitu.io/2020/4/20/17193bcd3c1c3ef6?w=262&h=486&f=png&s=13266)

场景：统一控制弹框显示隐藏，不用在`vue`实例中设置`isDialogShow`和修改值，不用在弹框关闭的时候修改`$parent`中的`isDialogShow`。

1. store/BooleanFlag.js

   ```javascript
   import {
     provide,
     inject,
     reactive,
   } from '@vue/composition-api'
   
   const bfSymbol = Symbol('BooleanFlag')
   
   export const useBooleanFlagProvider = () => {
     // 统一控制弹框显示隐藏
     const BooleanFlag = reactive({
       isDialogShow: false,
       isDialog2Show: false,
       isDialog3Show: false,
     })
     const setBooleanFlag = (keys) => {
       keys.forEach(key => {
         if (Object.keys(BooleanFlag).includes(key)) {
           BooleanFlag[key] = !BooleanFlag[key]
         }
       })
     }
     provide(bfSymbol, {
       BooleanFlag,
       setBooleanFlag,
     })
   }
   
   export const useBooleanFlagInject = () => {
     return inject(bfSymbol);
   };
   ```

2. store/index.js

   ``` javascript
   // vue3 vuex 替代方案
   import {
     useBooleanFlagProvider,
     useBooleanFlagInject
   } from './BooleanFlag'
   
   export {
     useBooleanFlagInject
   }
   
   export const useProvider = () => {
     useBooleanFlagProvider()
   }
   ```

3. init/initVueComposition.js

   ``` javascript
   import VueCompositionApi from '@vue/composition-api'
   import {
     useProvider
   } from '@/store'
   
   export default function initVueComposition(Vue) {
     Vue.use(VueCompositionApi)
   
     return function setup() {
       useProvider()
       return {}
     }
   }
   ```

4. init/index.js

   ``` javascript
   import initElement from './initElement'
   import initAppConst from './initAppConst'
   import initI18n from './initI18n'
   import initAPI from './initAPI'
   import initRouter from './initRouter'
   import initVueComposition from './initVueComposition'
   
   // 往Vue原型上追加内容，简化开发调用，原型上追加内容是不会影响性能的，因为原型在内存中只存在一份
   export default function initVue(Vue) {
     initElement(Vue)
     initAppConst(Vue)
     const i18n = initI18n(Vue)
     const router = initRouter(Vue)
     initAPI(Vue)
     const setup = initVueComposition(Vue)
   
     return {
       i18n,
       router,
       setup
     }
   }
   ```

5. main.ts

   ``` javascript
   import Vue from 'vue'
   import App from './App.vue'
   
   import initVue from './init'
   
   import 'static/css/base.css'
   import 'static/css/index.css'
   
   const init = initVue(Vue)
   
   new Vue({
       ...init,
       render: h => h(App),
   }).$mount('#app')
   ```

6. vue文件注入

   ``` vue
   <template>
     <div>
       <div>
         <span>vuex:</span>
         <span>{{ "isDialogShow  :  " + BooleanFlag.isDialogShow }}</span>
         <el-button @click="onDialogShow">onDialogShow</el-button>
       </div>
     </div>
   </template>
   <script>
   import { useBooleanFlagInject } from "@/store";
   
   export default {
     setup(props, ctx) {
       const { BooleanFlag, setBooleanFlag } = useBooleanFlagInject();
       const methods = {
         onDialogShow() {
           setBooleanFlag(["isDialogShow"]);
         },
       };
       return {
         BooleanFlag,
       };
     },
   };
   </script>
   ```

![](https://user-gold-cdn.xitu.io/2020/4/20/17193bd15e085b6e?w=164&h=99&f=jpeg&s=3381)

都看到这里了，点个赞，关注再走呗。