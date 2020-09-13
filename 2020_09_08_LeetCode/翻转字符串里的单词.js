/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  let res = ''
  let temp = ''
  s += ' ' // 吃掉最后一个单词
  let isStartEat = false // 开始吃字符
  s.split('').forEach((chart) => {
    if (chart !== ' ') {
      temp += chart
      isStartEat = true
    } else {
      if (isStartEat) {
        res = temp + ' ' + res
      }
      isStartEat = false
      temp = ''
    }
  })
  return res.trim()
}
reverseWords('the sky is blue ')
