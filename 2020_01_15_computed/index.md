本文主要描述如何巧妙应用`computed`来解决多个`watch`触发执行同一个方法的场景，经典的例子就是：__分页、下拉、输入搜索页面__页面。关于`computed`和`watch`的相关概念可以阅读 [Vue.js的computed和watch是如何工作的？]( https://juejin.im/post/5b87f13bf265da436479f3c1 )。博主就先不赘述了。话不多说，直接上代码。

1. ### 多个watch触发同一个方法

​	下面是实际开发常见的场景：__分页、下拉、输入搜索页面__的主要代码。重点代码是`watch`部分逻辑。这种实现方式的弊端：__监听过多，容易重复触发__。比如`onSizeChange`的时候要重置`currentPage`会触发两次`getData`。当然也可以不用`watch`来实现以上功能，这样的话就要绑定各种`@change`钩子函数，在多处钩子函数调用对应函数，这样显得更加不优美。

``` javascript
<template>
  <div>
    <div>
      <!-- 下拉切换类型 -->
      <el-select v-model="selection.value">
        <el-option
          v-for="item in selection.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 搜索输入框 -->
      <el-input v-model="search.value"></el-input>
      <!-- 分页 -->
      <el-pagination
        v-bind="pagination"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "watchPage",
  data() {
    return {
      selection: {
        options: [
          {
            value: "选项1",
            label: "选项1"
          },
          {
            value: "选项2",
            label: "选项2"
          }
        ],
        value: "选项1"
      },
      pagination: {
        currentPage: 1,
        pageSize: 100,
        pageSizes: [100, 200, 300, 400],
        layout: "total, sizes, prev, pager, next, jumper",
        total: 400
      },
      search: {
        label: "",
        value: ""
      }
    };
  },
  watch: {
    "search.value": "getData",
    "selection.value": "getData",
    "pagination.currentPage": "getData",
    "pagination.pageSize": "getData"
  },
  methods: {
    // 请求搜索后的分页数据
    getData() {
      const { currentPage, pageSize } = this.pagination;
      const postData = {
        currentPage, // 当前页
        pageSize,
        search: this.search.value, // 搜索值
        type: this.selection.value // 下拉值
      };
      console.log(postData);
      // api.getData(postData).then(res => {
      //   // ....
      // });
    },
    onSizeChange(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
    },
    onPageChange(val) {
      this.pagination.currentPage = val;
    }
  }
};
</script>

```

2. ### computed打包多个watch

   下面是通过`computed`打包多个`watch`的代码，主要关注点__computed、watch、getData__的变化。

   ``` javascript
   <template>
     <div>
       <div>
         <!-- 下拉 -->
         <el-select v-model="selection.value">
           <el-option
             v-for="item in selection.options"
             :key="item.value"
             :label="item.label"
             :value="item.value"
           ></el-option>
         </el-select>
         <!-- 搜索输入框 -->
         <el-input v-model="search.value"></el-input>
         <!-- 分页 -->
         <el-pagination
           v-bind="pagination"
           @size-change="onSizeChange"
           @current-change="onPageChange"
         ></el-pagination>
       </div>
     </div>
   </template>
   
   <script>
   export default {
     name: "computedPage",
     data() {
       return {
         selection: {
           options: [
             {
               value: "选项1",
               label: "选项1"
             },
             {
               value: "选项2",
               label: "选项2"
             }
           ],
           value: "选项1"
         },
         pagination: {
           currentPage: 1,
           pageSize: 100,
           pageSizes: [100, 200, 300, 400],
           layout: "total, sizes, prev, pager, next, jumper",
           total: 400
         },
         search: {
           label: "",
           value: ""
         }
       };
     },
     computed:{
       // 打包需要监听的值
       postData(){
         const { currentPage, pageSize } = this.pagination;
         return {
           currentPage, // 当前页
           pageSize,
           search: this.search.value, // 搜索值
           type: this.selection.value // 下拉值
         }
       }
     },
     watch: {
       "postData": "getData",
     },
     methods: {
       // 请求搜索后的分页数据
       getData() {
         console.log(this.postData); // 直接使用 computed 属性
         // api.getData(postData).then(res => {
         //   // ....
         // });
       },
       onSizeChange(val) {
         this.pagination.currentPage = 1;
         this.pagination.pageSize = val;
       },
       onPageChange(val) {
         this.pagination.currentPage = val;
       }
     }
   };
   </script>
   
   ```

   