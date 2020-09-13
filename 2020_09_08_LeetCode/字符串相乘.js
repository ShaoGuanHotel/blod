const num1 = '456'
const num2 = '123'

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function (num1, num2) {
  if (num1 === '0' || num2 === '0') return '0'
  const [minNum, maxNum] = num1.length > num2.length ? [num2, num1] : [num1, num2]
  const maxL = maxNum.length
  const minL = minNum.length
  const resLength = maxL + minL
  const result = new Array(resLength).fill(0)
  for (let i = maxL - 1; i >= 0; i--) {
    const m = maxNum[i] // 6
    for (let j = minL - 1; j >= 0; j--) {
      const n = minNum[j] // 3
      const ij = i + j
      const mul = n * m
      result[ij] += Math.floor(mul / 10)
      result[ij + 1] += mul % 10
    }
  }

  // 统一进位
  for (let k = resLength - 1; k >= 0; k--) {
    const num = result[k]
    if (num >= 10) {
      result[k] = num % 10
      result[k - 1] += Math.floor(num / 10)
    }
  }
  let str = ''
  let isStart = false
  result.forEach((item) => {
    if (item !== 0) {
      isStart = true
    }
    isStart && (str += item)
  })
  return str
}
console.log('>>>>>>>>>>>>> multiply(num1, num2) >>>>>>>>>>>>>>>>', multiply(num1, num2))
