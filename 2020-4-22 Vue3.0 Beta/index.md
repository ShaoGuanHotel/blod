小白：喂，Vue3.0我是放弃还是继续学习？你们一直到现在都还没有给我回电话。

牛老师：这个吧，大概4.21号晚上 9：00就能给你统一答复，你也不要着急，明白吧。

小白：你贵姓呀？

牛老师：我姓牛

小白：尤啊 哪个尤啊？

牛老师：牛

小白：优啊？

牛老师：牛！

小白：刘啊？

牛老师：牛！（逐渐暴躁）

小白：你给我说一下你那个字怎么写的吧？

牛老师：牛羊的牛！

小白：有氧的有啊？

牛老师：牛！

小白：啊，好的好的 我听到了，谢谢你啊，尤老师。

[高能经典名场面 快乐源泉！！]( https://www.bilibili.com/video/BV1kJ411u7xa/?spm_id_from=333.788.videocard.1 )

上面主要想表达：尤(cun)老(shu)师(lai)牛(gao)，优(xiao)秀(de)。

言归正传，首先还是要先感谢一下尤老师还有掘金相关工作人员组织了此次分享会。下面是呈上小弟的笔记，如有错误的地方，欢迎指正。整体思路就是按照老师的PPT串联的。另外推荐一个不错的学习网站：[vueschool]( https://vueschool.io/ )



## 一. 升级方式


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7dd6d5d2e6c0?w=711&h=389&f=png&s=63476)

`RFC(response 4 comment)`。提出提案，通过社区反馈讨论拍板的，特别是大的改动。（尴尬，社区地址我没有找到，欢迎补充）。设计细节，实现方式的一手材料。

## 二. 亮点


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7dddf344b669?w=716&h=397&f=png&s=79768)
### 1. 性能


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7de149c3f426?w=652&h=362&f=png&s=98575)

#### 1.1 virtual dom

现在有那么多优秀的前端框架，可能我们这些晚辈很难体会到以前前辈刀耕火种，js操作原生`DOM`开发的痛苦。`Virtual DOM`的核心思想就是抽象原生`DOM`，封装对应操作`API`，难点是`Diff`算法。推荐一个帖子，主要从`WWH`（what why how）这几点精要介绍了`virtual dom`。[深入框架本源系列 —— Virtual Dom]( https://juejin.im/post/5b10dd36e51d4506e04cf802 )。

此次的优化，不是从虚拟节点的创建，`Diff`上下功夫的；而是通过分析模板，根据常见的几个不同场景，编译出更加快的`render function`。我们可以在[vue-next-template-explorer]( [https://vue-next-template-explorer.netlify.app](https://vue-next-template-explorer.netlify.app/) )上尝试不同场景生成的`render function`。

#### 优化1：静态节点和动态节点，`static props`以及动态`props`的区别


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7de49f24f088?w=1270&h=287&f=png&s=40905)

通过`patchflag`实现，`patchflag`有两个含义：1.用来表达当前节点需要更新，`static`节点没有这个参数，更新的时候跳过；2.需要更新情况组合，比如：1（只更新显示文本），8（只更新属性），9（更新显示文本和属性）。更新的时候只更新带`patchflag`的节点，无论节点层级有多深；不同的`patchflag`调用不同的更新函数，忽略检测其他需要对比和更新的内容。更新只关注变化的内容，也就是让更新更加具体，更加快。通过编译器编译时分析解决了`virtual dom`最耗性能的`Diff`算法。既有手写`render function`的灵活性，又有性能保证。

#### 优化2：静态节点提升

静态节点创建一次，终生使用，节省了对象创建销毁的性能。优化了运行时内存占用。特别是在大型网站上，优化效果更佳，因为大型网站会有大量静态节点。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7de696767b49?w=1288&h=508&f=png&s=66020)

#### 优化3：cacheHandlers(事件侦听器缓存)

运行时绑定的事件可能会发生改变，通过事件侦听器缓存可以解决事件侦听器中途发生改变，需要刷新节点的情况，特别是父组件传递给子组件的事件，刷新消耗会更大。`React`开发者应该都有体会：除非需要传递参数，都会尽量避免以`()=>this.onClick()`这种形式进行事件绑定。

1. 未开启`cacheHandlers`



![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e2b320faeab?w=1355&h=287&f=png&s=32292)

我们可以看到`onClick`是上下文的一个参数，而且`onClick`发生改变的时候会触发节点更新

2. 开启`cacheHandlers`



![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e0986bc8fa1?w=1335&h=273&f=png&s=28872)


事件会在第一次渲染被缓存起来，可以看到节点已经没有`patchflag`了，后面再动态修改`onClick`都不会触发节点刷新。

`Vue3.0`手写的内联函数默认被缓存起来。`React`如果手写内联函数绑定事件，节点每次都会触发更新。当然React可以通过`useMemo`包裹来优化，感兴趣的可以阅读[react Hook之useMemo、useCallback及memo]( https://juejin.im/post/5d8dd1d6f265da5b950a431c )和[官方文档]( https://reactjs.org/docs/hooks-reference.html#usememo )，`Vue3.0`自动做了这一步。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e026c00defc?w=1350&h=304&f=png&s=31355)

#### 优化4：SSR（服务端渲染）

大量的静态节点，甚至是少量变化的节点都会会直接编译为一个字符串，push到一个buffer内部，整个模板只存在剩余动态的节点。对比React服务端基于Virtual Dom渲染出来的字符串会快得多得多。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e2ec0f4ac8e?w=1337&h=428&f=png&s=57579)

更多内容可见：[Vue.js 服务器端渲染指南]( https://ssr.vuejs.org/zh/ )

#### 整体性能对比表格


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e30b1951e67?w=1137&h=368&f=png&s=344692)

### 2. tree-shaking

抖一抖精神抖擞，抖去残枝烂叶，也就是无用的`API`不打包到最终的包内，按需`import`。`Vue2.x`是一并引入的。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e3391fb62b7?w=1166&h=644&f=png&s=292085)

举例：

没有使用`v-model`时候的`input`，编译结果：


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e356948550f?w=1340&h=250&f=png&s=25304)

使用了`v-model`时候的`input`，编译结果：


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e37493e81a4?w=1349&h=332&f=png&s=38532)

### 3. 组合式API（重头）


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e396288cdef?w=1169&h=644&f=png&s=191646)

 [Vue Composition API](https://composition-api.vuejs.org/) 中有介绍为何要引入Composition API，起到什么作用等。

先上一个对比图：


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e3fb5ca403b?w=1200&h=1201&f=png&s=206094)

不同的颜色代表不同关注点的业务代码，相同颜色的代码代表处理相同业务逻辑所需的代码。在这上面我深有体会，之前接手开发一个js两千多行的.vue文件，什么概念呢，光computed都有三十多个，经过我优化后到一千多行，维护起来相当痛苦。我是通过添加业务锚点来进行分类，比如：111--->处理业务1；222--->处理业务2...。然后在对应分散到文件内的`template,data,computed,methods,watch`等中添加对应的锚点（111，222）。然后定位问题的时候通过搜索对应锚点来跳转，**只要你搜索回车按的够快，这个文件就只有100行代码**。

目前体验`Vue3.0`的语法可以将处理相关业务逻辑的`data,method,computed`放在一起，公共的部分还很方便的抽取出去。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e44ab8c9d5c?w=256&h=160&f=jpeg&s=8666)

我们也不用过分担心，新添加的组合式`API`和`Vue2.x`的`option API`是可以共同使用的。建议不再使用`mixin`抽取公共代码。



### 4.Fragments（碎片），Teleport，Suspense

1. Fragments：不再限制只有根节点，甚至可以是纯文本，会自动变成一个Fragments碎片

2. Teleport：一个新的element，后续再了解；

3. Suspense：

   在`React`上，如果将`Suspense `翻译为中文的话是`等待`、`悬垂`、`悬停`的意思。**React给出了一个更规范的定义**：

   **Suspense 不是一个‘数据获取库’, 而是一种提供给‘数据获取库’的`机制`，数据获取库通过这种机制告诉 React 数据还没有准备好，然后 React就会等待它完成后，才继续更新 UI**。 简单总结一下 Suspense 是 React 提供的一种异步处理的机制, 它不是一个具体的数据请求库。**它是React 提供的原生的组件异步调用原语**。它是 Concurrent 模式特性集合中的重要角色。[React Concurrent 模式抢先预览上篇: Suspense the world]( https://juejin.im/post/5db65d87518825648f2ef899#heading-2 ).

   对比`React`的`Suspense`收益，综合考虑实现成本和收益，Vue3采用不做调度的情况下，采用粗暴的方法实现Suspense。

   小朋友，你是不是很多问号？？？？懵逼树下懵逼我。


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e486149ea59?w=212&h=207&f=jpeg&s=13913)

   	也就是：嵌套的组件树渲染之前先在内存中渲染，渲染过程中会记录存在异步以来的组件，当所有嵌套的异步依赖组件被`resolve`之后才会把整个树渲染到`dom`里面去，结合`composition API`采用`async setup()`定义异步组件。

### 5. Typescript友善支持


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e4a424b3803?w=1153&h=642&f=png&s=317617)

1. `Vue3`采用`Typescript`重写，好处是类型提示，类型检测，自动补全
2. `Vue3.0 class`提案被废弃了，`class`不是第一推荐的使用方式。灰常喜欢`class`风格的用户，依然可以支持`class`写法， **[vue-class-component](https://github.com/vuejs/vue-class-component)** 作为单独的库。
3. `Vue3+Typescript`开发插件开发ing。

### 6.Custom Renderer API（自定义渲染API）


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e4c80cc92d3?w=1164&h=646&f=png&s=239506)

1. `NativeScript Vue`和`Vue3`整合ing
2. 荷兰老铁在开发一套工具（ **[vugel](https://github.com/Planning-nl/vugel)** ），用`Vue`的语法表达`WebGL`的渲染逻辑，渲染出来的内容可以嵌入到`Vue`应用。

### 7.剩余工作


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e4eec9db352?w=1155&h=635&f=png&s=143855)

相应文档，`Vue`相关的库，测试工具及`DevTools`在如火如荼的开发测试中。库开发要求：`API`基本不改动。

尤老师开发的小游戏--**[ vite](https://github.com/vuejs/vite)**。简易的http服务器，无需打包，编译。起一个服务器就能写`vue`文件，还支持热更新。

### 8.Vue2.x该何去何从


![](https://user-gold-cdn.xitu.io/2020/4/24/171a7e5115df4ed4?w=1158&h=644&f=png&s=216758)

1. 2.7将会是最后一个更新版本
2. 不损坏兼容性的一些好的·Vue3·的功能合并到2.7版本
3. 3.0不兼容的用法会提出警告，18个月后只剩下安全性的描述

忠告：升级一定要考虑成本，如果你的项目很稳定，而且没有太大的对新功能的墙裂需求的话，建议就是  **能悠着点就悠着点**

### 9.粉丝沟通环节

1. 兼容IE11？会，可以build出兼容IE11的版本，开发过程中如果涉及兼容问题，会进行打印提示；

2. 3.0什么时候可以投入项目使用？

   Beta可用，生产项目建议还不要用，小的项目可以试水，预计年终（中？）会稳定。

3. Composition Api会成为学习阻力吗？

   模板语法未变，Options API和Composition API并存，Composition API更适合造轮子，写公共组件的开发者使用。如果你感觉Composition API在你实际开发中收益小，依然可以使用Option API的写法。

4. bug是否会继续进化？

   路由，vuex等生态稳定后再腾出精力进化。

5. 如何护发？

   用了一个月之后，头发DUANG~~~~。是头发的特技，是特技的头发，是化学的成分，是特技的头发，脱发脱发~。

   我推荐一下[我的洗发液]( https://www.bilibili.com/video/BV1Yx411A7wM/?spm_id_from=333.788.videocard.0 )。

### 总结

​		下班之余，通过看视频，写笔记，自己动手，写博客（重点是不能抄袭哦，要有自己的见解和理解），能加深印象，学到许多新的东西。怎么说呢，会强迫自己去了解一些之前不愿意了解的东西，水滴石穿，量变到质变。不管写的好与坏，对自己总是好的，奥利给，一giao奥利giao，干就完了。