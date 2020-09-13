/**
 * 1. Better Comments
 * 注释加上不同的前缀,让注释具有不同的含义
 */

// 普通注释
/**
 * 普通块状注释
 */
// ! error 危险的一些操作注释
// ? doubt 有疑问的地方
// TODO todo 未完成的工作任务

/**
 * 2. Bracket Pair Colorizer
 * 括号匹配,颜色区别
 */
const BracketPair = (a, b) => {
  ((((a))))
  const respon = {
    answer: (a + b) * (a + (a / b))
  }
}

/**
 * ident-rainbow
 * 缩进匹配
 */

/**
 * change-case
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
 * 4. javascript console utils
 * 选中需要打印的内容,快捷键:ctrl+shift+L
 * 自动在下面一行追加打印日志代码
 */
var changeCaseDemo = 1
console.log('changeCaseDemo: ', changeCaseDemo);

/**
 * 5. Sort Js Object keys
 * js对象属性排序
 * 框选需要排序的对象(以括号为界,包含括号)
 * ctrl + shift + p 打开命令行
 * 输入sort就能找到对应命令
 */

const obj = {
  ajoif: 'asdf',
  acoif: 'asdf',
  aboif: 'asdf',
  eor: 'asdf',
  dor: 'asdf',
  jalsd: 'ahodsj',
  kac: 'adsf'
}
const sortJsObjectKeys = {
  acoif: 'asdf',
  aboif: 'asdf',
  ajoif: 'asdf',
  dor: 'asdf',
  eor: 'asdf',
  jalsd: 'ahodsj',
  kac: 'adsf'
}

/**
 * 6.Code Runner
 * 运行框选代码,一般用于测试一些函数或者进行一些尝试,运行内核和nodejs一样,所以不能有DOM和BOM
 * 框选需要测试的代码,快捷键:ctrl+alt+n
 */

// https://pan.baidu.com/s/1ZIDsqN31_e6PWbR8J5TF4Q 5lym

[1,2,3].forEach(a=>console.log(a))