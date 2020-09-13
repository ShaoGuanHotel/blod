// 交换两个变量，不起中间变量且适用于值类型和引用类型的交换
(() => {

  let x = {
    a: 'x'
  }
  let y = {
    a: 'y'
  }
  console.log('交换前x.a, y.a：', x.a, y.a);
  //交换前x.a, y.a： x y
  [x, y] = [y, x]
  // 还可以
  // x = [y,y=x][0]
  console.log('交换后x.a, y.a：', x.a, y.a);
  //交换后x.a, y.a： y x
})()

// 数组拼接
(() => {
  let a = [1, 2, 3]
  let b = [3, 4, 5]
  let c = [6, 7]
  a.push(...b, ...c) // 不重新赋值
  a = [...a, ...b, ...c]
  a = a.concat(b, c)
})()