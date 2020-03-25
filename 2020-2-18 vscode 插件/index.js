// 1. Better Comments
// ! error
// ? doubt
// TODO todo

//  2. Bracket Pair Colorizer
const BracketPair = (a, b) => {
  const respon = {
    answer: (a + b) * (a + (a / b))
  }
}

/**
 * 3. change-case
 * 使用方法：(当然也可以设置快捷键，可以挑几个常用的进行设置)
 * a. 选中需要操作的字符
 * b. 快捷键输入：ctrl + shift + p 打开命令行
 * c. 输入：change case commondands
 * d. 选择要切换的模式
 * 注意：间隔符是可以组合的
 * 比如：change.case_demo-demo2 demo3 --> changeCaseDemoDemo2Demo3
 */
// changeCaseDemo change case camel --> changeCaseDemo         // 驼峰式
// changeCaseDemo change case constant --> CHANGE_CASE_DEMO    // 常量
// changeCaseDemo change case dot --> change.case.demo         // 包名
// changeCaseDemo change case kebab --> change-case-demo       // html属性
// changeCaseDemo change case lower --> changecasedemo         // 全小写
// changeCaseDemo change case lowerFirst --> changeCaseDemo    // 第一个转换小写
// changeCaseDemo change case no --> change case demo          // 空格 
// changeCaseDemo change case path --> change/case/demo        // 路径
// changeCaseDemo change case sentence --> Change case demo    // 句子：首字母大写 其他小写
// changeCaseDemo change case snake --> change_case_demo       // “_”进行拼接
// changeCaseDemo change case swap --> CHANGEcASEdEMO          // 大小写反转
// changeCaseDemo change case title --> Change Case Demo       // 标题：单词首字母大写
// changeCaseDemo change case upper --> CHANGECASEDEMO         // 全大写
// changeCaseDemo change case upperFirst --> ChangeCaseDemo    // 首字母大写

/**
 * 4. ES7 React/Redux/GraphQL/React-Native snippets
 * 常用的代码片段
 */

 // 5. javascript console utils
var changeCaseDemo = 1
console.log('changeCaseDemo: ', changeCaseDemo);