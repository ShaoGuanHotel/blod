## Vue自定义render统一项目组弹框功能

**往期推荐文章（希望各位看官有收获）**

- [Lodash那些“多余”和让人眼前一亮的 API](https://juejin.im/post/5ed3cd366fb9a047f129c39a)
- [JavaScript好用还未火的注解@Decorator（注解 | 装饰器 | 装潢器）](https://juejin.im/post/5eca298af265da77186a5869)

下文**代码篇幅较大部分**，**只需关注带*号部分**，不会影响阅读体验

### 一、本文收获

1. 为什么要取缔常规弹框写法；
2. 深层参数合并；
3. `pick`抽取保存数据；
4. 如何统一Vue项目弹框及简化调用

### 二、为什么要统一封装弹框；要封装成怎样

​		通过举例常规弹框的写法。我们可以体会到，通常要弹出一个页面，需要创建一个页面`normalDialog.vue`包裹`dialogBody.vue`（弹框主体）；需要`parent.vue`设置flag控制弹框显示隐藏，`normalDialog.vue`关闭的时候设置`parent.vue`对应`flag`。缺点：**流程繁杂、配置繁琐、不灵活、样式不统一和参数传递麻烦等**。如果一个项目弹框较多的时候，弊端将会更明显，大量的`isXxxDialogShow`，大量的`vue`文件。因此项目组急需一个能简单配置就能弹出弹框的`API`。

#### 1. 常规弹框写法

1. **`dialoBody.vue`（弹框主体）**，此处采用`Composition API`的写法。只做了简单的页面，包含校验，抽取保存数据的常规逻辑。

``` javascript
<template>
  <div class="dialog-body">
    <div class="item">
      <div>名称</div>
      <el-input v-model="name"></el-input>
    </div>
    <div class="item">
      <el-radio-group v-model="attention">
        <el-radio label="已关注"></el-radio>
        <el-radio label="等下关注"></el-radio>
      </el-radio-group>
    </div>
    <div class="item">
      <el-radio-group v-model="like">
        <el-radio label="已点赞"></el-radio>
        <el-radio label="等下点赞"></el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import pick from 'lodash/pick'
import { Message } from 'element-ui'

export default {
  props: {
    defaultName: String,
  },
  setup(props, ctx) {
    const ATTENTIONED = '已关注'
    const LIKED = '已点赞'
    const state = reactive({
      name: props.defaultName, // 名称
      attention: '已关注', // 关注
      like: '已点赞', // 点赞
    })
    /*************************************************************
     * 页面绑定的事件
     * 建议写法:
     * 1. 定义methods常量
     * 2. 处理相关业务逻辑的时候,需要绑定事件到页面的时
     *    建议通过methods.onXxx = ()=>{ // 相关逻辑 }的形式定义
     *    好处1: onXxx定义的位置和相关业务逻辑代码关联一起
     *    好处2: 可以统一通过...methods的形式在setup统一解构
     *    好处3: 当页面逻辑复杂,需要操作的数据关联性强,不可拆解组件;
     *           可将相关业务的代码在独立模块定义;
     *           独立模块暴露API handleXxx(methods,state),流水线加工methods;
     *           和Vue2源码一样,流水线加工的思想.
     */
    const methods = {}
    // 校验名称
    methods.onNameBlur = () => {}

    // ************************ 向外暴露的API ************************
    const apiMethods = {
      // 保存前校验
      isCanSave() {
        if (state.attention !== ATTENTIONED || state.like !== LIKED) {
          Message.error('未关注或者点赞,不能关闭,嘻嘻')
          return false
        }
        return true
      },
      // 获取保存数据
      getSaveData() {
        // ******* lodash pick 从对象中抽取数据
        return pick(state, ['name', 'attention', 'like'])
      },
    }
    return {
      ...toRefs(state),
      ...methods,
      apiMethods,
    }
  },
}
</script>

<style lang="less">
.dialog-body {
  width: 100%;
  height: 100px;
}
</style>
```

2. **`normalDialog.vue`包裹弹框主体`dialoBody.vue`**

``` javascript
<template>
  <el-dialog 
    title="帅哥,美女,我是标题" 
    :visible.sync="isShow" 
    width="30%" 
    :before-close="onClose"
  >
    <dialog-body default-name="参数传递的名称" ref="inner"></dialog-body>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onOK">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dialogBody from './dialogBody.vue'
export default {
  components: {
    dialogBody,
  },
  data() {
    return {
      isShow: true,
    }
  },
  methods: {
    onClose() {
      // *********** 修改parent.vue ********
      this.$parent.isNormalDialogShow = false
    },
    // ******* 控制保存流程 ********
    onOK() {
      const inner = this.$refs.inner
      // 校验是否可以保存
      if (inner.apiMethods.isCanSave()) {
        // 获取保存数据
        const postData = inner.apiMethods.getSaveData()
        console.log('>>>>> postData >>>>>', postData)
        // 保存成功后关闭弹框
        this.onClose()
      }
    },
  },
}
</script>
```

3. **`parent.vue`**

``` javascript
// html 部分
<normal-dialog v-if="isNormalDialogShow" />

// Js部分
data(){
	isNormalDialogShow:false
}
methods:{
    onDialogShow(){ // ******控制弹框显示*****
        this.isNormalDialogShow = true
    }
}
```

#### 2. 要封装成怎样

**2.1 API诉求：**

- 调用简单；
- 不用设置`isXxxDialogShow`；
- 传参简便；
- 能简便控制`el-dialog`的样式属性；
- 可控制弹框关闭流程。

**2.2 理想API：**

``` javascript
import dialogBody from './dialogBody.vue'
const dialog = new JSDialog({
  comonent: dialogBody, 
  dialogOpts: { // 可扩展配置
    title: 'JSDialog设置的弹框标题',
    width: '400px'
  },
  props: {
    defaultName: 'JSDialog传递的参数',
  },
  onOK() {
    const inner = dialog.getInner() // 能取到dialogBody的引用
    // 控制流程
    if (inner.apiMethods.isCanSave()) {
      // 获取保存数据
      const postData = inner.apiMethods.getSaveData()
      console.log('>>>>> postData >>>>>', postData)
      // 关闭弹框
      dialog.close()
    }
  },
  onCancel() {
    dialog.close() // 弹框关闭
  },
})
dialog.show() // 弹框显示
```

### 三、如何封装

​		动态控制显示内容，脑海浮现的三个方案：**卡槽、动态组件和重写`render`**。下面在动态弹框场景下简单对比三个方案。

- [**slot（卡槽）**]( https://cn.vuejs.org/v2/api/#slot )，和`el-dialog`原理类似，只是再封装了一层，少定义了`normalDialog.vue`文件。**缺点：调用复杂，不灵活；不容易控制关闭的流程；只能在`template`中定义**。
- [**component（动态组件）**]( https://cn.vuejs.org/v2/api/#component )，创建`commonDialog.vue`，统一挂在`App.vue`下，利用` <component :is="componentId"></component> `动态切换弹框主体，`commonDialog.vue`监听`componentId`变化来切换弹框主体。**缺点：要提前将所有弹框主体组件注册到commonDialog.vue页面的components上；依赖于vuex，侵入性较强；纯js文件通过vuex弹出弹框相对复杂，不灵活**。
- **重写`render`**，`render`是`Vue`对造轮子开发者开放的后门。动态弹框可作为独立的功能模块，内部通过new `Vue`，重写`render`控制渲染内容。**独立`Vue`实例，可预先创建，可在任何位置控制弹框，灵活，清晰**。**缺点：暂无**
#### 1. 整体代码

先整体预览一下代码，下面再细分讲解。

``` javascript
import Vue from 'vue'
import merge from 'lodash/merge'
import orderBy from 'lodash/orderBy'

// 按钮配置项构造器
function btnBuilder(options) {
  const defaultBtn = {
    text: '按钮', // 显示文本
    clickFn: null, // 点击回调
    type: 'default', // 样式
    isHide: false, // 是否隐藏
    order: 2 // 顺序
  }
  return { ...defaultBtn, ...options }
}

export default class JSDialog {
  constructor(originOptions) {
    this.options = {}
    this.vm = null
    this._mergeOptions(originOptions)
    this._initVm()
  }
  // 参数合并
  _mergeOptions(originOptions) {
    const defaultOptions = {
      component: '', // 弹框主体vue页面
      // 可扩展el-dialog官方api所有配置项,小驼峰aaaBbbCcc
      dialogOpts: {
        width: '40%',
        title: '默认标题'
      },
      // 传入弹框主体vue组件的参数
      props: {},
      // 点击确定回调
      onOK: () => {
        console.log('JSDialog default OK'), this.close()
      },
      // 点击取消回调
      onCancel: () => {
        console.log('JSDialog default cancel'), this.close()
      },
      footer: {
        ok: btnBuilder({
          text: '确定',
          type: 'primary',
          order: 0
        }),
        cancel: btnBuilder({
          text: '取消',
          order: 1
        })
      }
    }
    // 参数合并到this.options
    merge(this.options, defaultOptions, originOptions)
    const footer = this.options.footer
    Object.entries(footer).forEach(([key, btnOptions]) => {
      // 确定和取消默认按钮
      if (['ok', 'cancel'].includes(key)) {
        const clickFn = key === 'ok' ? this.options.onOK : this.options.onCancel
        // 默认按钮回调优先级: footer配置的clickFn > options配置的onOK和onCancel
        btnOptions.clickFn = btnOptions.clickFn || clickFn
      } else {
        // 新增按钮
        // 完善配置
        footer[key] = btnBuilder(btnOptions)
      }
    })
  }
  _initVm() {
    const options = this.options
    const beforeClose = this.options.footer.cancel.clickFn // 弹框右上角关闭按钮回调
    this.vm = new Vue({
      data() {
        return {
          // 需要响应式的数据
          footer: options.footer, // 底部按钮
          visible: false, // 弹框显示及关闭
          beforeClose
        }
      },
      methods: {
        show() {
          // 弹框显示
          this.visible = true
        },
        close() {
          // 弹框关闭
          this.visible = false
        },
        clearVm() {
          // 清除vm实例
          this.$destroy()
        }
      },
      mounted() {
        // 挂载到body上
        document.body.appendChild(this.$el)
      },
      destroyed() {
        // 从body上移除
        document.body.removeChild(this.$el)
      },
      render(createElement) {
        // 弹框主体
        const inner = createElement(options.component, {
          props: options.props, // 传递参数
          ref: 'inner' // 引用
        })
        // 控制按钮显示隐藏
        const showBtns = Object.values(this.footer).filter(btn => !btn.isHide)
        // 控制按钮顺序
        const sortBtns = orderBy(showBtns, ['order'], ['desc'])
        // 底部按钮 jsx 写法
        const footer = (
          <div slot="footer">
            {sortBtns.map(btn => (
              <el-button type={btn.type} onClick={btn.clickFn}>
                {btn.text}
              </el-button>
            ))}
          </div>
        )
        // 弹框主体
        const elDialog = createElement(
          'el-dialog',
          {
            // el-dialog 配置项
            props: {
              ...options.dialogOpts,
              visible: this.visible
            },
            // **** 看这里，visible置为false后，el-dialog销毁后回调 *****
            on: {
              closed: this.clearVm
            },
            ref: 'elDialog'
          },
          // 弹框内容：弹框主体和按钮
          [inner, footer]
        )
        return elDialog
      }
    }).$mount()
  }
  // 封装API
  // 关闭弹框
  close() {
    this.vm.close()
  }
  // 显示弹框
  show() {
    this.vm.show()
  }
  // 获取弹框主体实例，可访问实例上的方法
  getInner() {
    return this.vm.$refs.inner
  }
}
```

#### 2. 参数合并

​		要做到`API`诉求中的：调用简单、传参简便和可扩展控制弹框样式。参数合并便是**成本最小**的实现方案，配合`TS`效果更佳。定义默认参数，通过`lodash`的`merge`，合并深层属性。通过参数合并还能做到自定义`footer`按钮，控制文本，样式，顺序和执行回调。

``` javascript
// 参数合并
_mergeOptions(originOptions) {
  const defaultOptions = {
    component: '', // 弹框主体vue页面
    // 可扩展el-dialog官方api所有配置项,小驼峰aaaBbbCcc
    dialogOpts: {
      width: '40%',
      title: '默认标题'
    },
    // 传入弹框主体vue组件的参数
    props: {},
    // 点击确定回调
    onOK: () => {
      console.log('JSDialog default OK'), this.close()
    },
    // 点击取消回调
    onCancel: () => {
      console.log('JSDialog default cancel'), this.close()
    },
    footer: {
      ok: btnBuilder({
        text: '确定',
        type: 'primary',
        order: 0
      }),
      cancel: btnBuilder({
        text: '取消',
        order: 1
      })
    }
  }
  // 参数合并到this.options
  merge(this.options, defaultOptions, originOptions)
  const footer = this.options.footer
  Object.entries(footer).forEach(([key, btnOptions]) => {
    // 确定和取消默认按钮
    if (['ok', 'cancel'].includes(key)) {
      const clickFn = key === 'ok' ? this.options.onOK : this.options.onCancel
      // 默认按钮回调优先级: footer配置的clickFn > options配置的onOK和onCancel
      btnOptions.clickFn = btnOptions.clickFn || clickFn
    } else { // 新增按钮
      // 完善配置
      footer[key] = btnBuilder(btnOptions)
    }
  })
}
```

#### 3. render函数

​		摘取一段[渲染函数 & JSX]( https://cn.vuejs.org/v2/guide/render-function.html )官方文档关于`render`的描述： Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。 

​		官方文档对渲染函数的写法，参数，对应JSX写法介绍已经很详细，这里就不再赘述。下面代码是在最新vue-cli创建项目上运行的，尝试了JS参数创建元素和JSX创建元素两种写法。

``` javascript
render(createElement) {
  // 弹框主体
  const inner = createElement(options.component, {
    props: options.props, // 传递参数
    ref: 'inner' // 引用
  })
  // 控制按钮显示隐藏
  const showBtns = Object.values(this.footer).filter(btn => !btn.isHide)
  // 控制按钮顺序
  const sortBtns = orderBy(showBtns, ['order'], ['desc'])
  // 底部按钮 jsx 写法
  const footer = (
    <div slot="footer">
      {sortBtns.map(btn => (
        <el-button type={btn.type} onClick={btn.clickFn}>
          {btn.text}
        </el-button>
      ))}
    </div>
  )
  // 弹框主体
  const elDialog = createElement(
    'el-dialog',
    {
      // el-dialog 配置项
      props: {
        ...options.dialogOpts,
        visible: this.visible
      },
      on: {
        closed: this.clearVm
      },
      ref: 'elDialog'
    },
    // 弹框内容：弹框主体和按钮
    [inner, footer]
  )
  return elDialog
}
```

#### 4. 封装API

​	暂时只封装了三个`API`，可根据不同的场景扩展`API`，比如弹框不销毁隐藏，弹框刷新等。

1. `show()`，弹框显示

显示主要是修改`el-dialog`的`visible`为`true`，控制挂载到`body`上的弹框显示。

``` javascript
show() {
  this.vm.show()
}
```

2. `close()`，弹框关闭

关闭处理流程：修改`el-dialog`的`visible`为`false`；触发`el-dialog`的`closed`事件；执行`clearVm`；执行`vm`的`$destroy()`；`destroyed()`回调中将`$el`从`body`中移除。

``` javascript
close() {
  this.vm.close()
}
```

3. `getInner()`，获取弹框主体实例，可用于访问实例上的方法，控制按钮流程

``` javascript
getInner() {
  return this.vm.$refs.inner
}
```

### 四、如何使用

#### 1. 最简单场景，只配置页面

按钮事件回调采用默认的回调，确定和取消按钮都可关闭弹框

``` javascript
import dialogBody from './renderJsx/dialogBody'
const dialog = new JSDialog({
  component: dialogBody,
})
dialog.show() // 弹框显示
```

效果如下：

01.png

#### 2. 控制弹框样式及确定流程

​	可自定义el-dialog支持的配置项，见[Dialog 对话框]( https://element.eleme.cn/2.0/#/zh-CN/component/dialog )；比如：title、 customClass 。通过customClass可统一控制项目内弹框的风格；可控制确定取消按钮代码回调。

``` javascript
import dialogBody from './renderJsx/dialogBody'
const dialog = new JSDialog({
  component: dialogBody,
  dialogOpts: {
    title: '靓仔，美女欧嗨呦',
    customClass:'js-dialog'
  },
  props: {
    defaultName: 'JSDialog传递的参数'
  },
  onOK() {
    const inner = dialog.getInner() // 能取到dialogBody的引用
    // 控制流程
    if (inner.apiMethods.isCanSave()) {
      // 获取保存数据
      const postData = inner.apiMethods.getSaveData()
      console.log('>>>>> postData >>>>>', postData)
      // 关闭弹框
      dialog.close()
    }
  },
  onCancel() {
    dialog.close() // 弹框关闭
  }
})
```

效果如下：

02.png

#### 3. 自定义footer

自定义按钮可控制执行回调，样式，顺序，显示与隐藏

``` javascript
import dialogBody from './renderJsx/dialogBody'
const dialog = new JSDialog({
  component: dialogBody,
  footer: {
    ok: { // 修改默认按钮
      text: '新增'
    },
    cancel: { // 隐藏默认按钮
      isHide: true
    },
    add: { // 新增按钮
      text: '另存为',
      clickFn() {
        dialog.close()
      },
      order: -1 // 控制按钮顺序，order小的显示在右边
    },
    add2: {
      text: '新增按钮2',
      clickFn() {
        dialog.close()
      },
      order: 3
    }
  }
})
dialog.show() // 弹框显示
```

效果如下：

03.png