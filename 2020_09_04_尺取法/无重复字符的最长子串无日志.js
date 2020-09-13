const str = 'abcabcbb'
function getMaxLength(str = '') {
  // 1特殊情况处理
  if (str.length === 0) return 0 
  let start = 0
  let end = 0
  let max = 0
  const charts = [...str]
  while (end < charts.length) {
    // 2 截取区间
    const temp = charts.slice(start, end)
    const chart = charts[end]
    // 3 具体判断逻辑
    const findIndex = temp.indexOf(chart)
    end++ // 5
    // 4 何时推进端点
    if (findIndex !== -1) {
      // 5 如何推进
      // 如:temp为“abcdef”，下一个字符为“c” findIndex为2
      // 则temp变化为"defc"；start指向“d”
      start += findIndex + 1 
    }
    // 6 更新minOrMax
    if (end - start > max) {
      max = end - start
    }
  }
  return max
}
getMaxLength(str)
