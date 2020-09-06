const str = 'abcabcbb'
let step = 0
function getMaxLength(str = '') {
  if (str.length === 0) return 0
  let start = 0
  let end = 0
  let max = 0
  const charts = [...str]
  while (end < charts.length) {
    const temp = charts.slice(start, end)
    const chart = charts[end]
    const findIndex = temp.indexOf(chart)
    // ----------------------------------------------------------- 辅助日志 -----------------------------------------------------------
    ++step
    console.log(`step ${step} end  :`,new Array(charts.length).fill(' ').map((item, index) => (index === end ? '↓' : index)).join(''))
    console.log(`step ${step}      :`,charts.join(''), `${temp.join('')}.indexOf(${chart}) is ${findIndex} ${findIndex === -1 ? '' : 'start-->'+(start+1+findIndex)} max=${max} end${end}-start${start}=${end - start}`)
    console.log(`step ${step} start:`,new Array(charts.length).fill(' ').map((item, index) => (index === start ? '↑' : index)).join(''))
    // ----------------------------------------------------------- 辅助日志 -----------------------------------------------------------
    end++
    if (findIndex !== -1) {
      start += findIndex + 1
    }
    if (end - start > max) {
      max = end - start
    }
  }
  return max
}
getMaxLength(str)
