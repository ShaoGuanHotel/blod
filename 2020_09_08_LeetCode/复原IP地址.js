// 复原IP地址 https://leetcode-cn.com/explore/interview/card/bytedance/242/string/1044/
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  const sLength = s.length
  if (sLength < 4 || sLength > 12) return []
  const max3 = sLength - 1
  const max2 = sLength - 2
  const max1 = sLength - 3
  const isIPNumber = (item) => {
    if (item.startsWith('0') && item.length > 1) return false
    return Number(item) <= 255
  }
  const result = []
  // 25525511135
  for (let i1 = 1; i1 <= max1; i1++) {
    if (sLength - i1 > 9) {
      continue
    }
    const num1 = s.slice(0, i1)
    if (!isIPNumber(num1)) {
      continue
    }
    for (let i2 = i1 + 1; i2 <= max2; i2++) {
      if (sLength - i2 > 6) {
        continue
      }
      const num2 = s.slice(i1, i2)
      if (!isIPNumber(num2)) {
        continue
      }
      for (let i3 = i2 + 1; i3 <= max3; i3++) {
        if (sLength - i3 > 3) {
          continue
        }
        const num3 = s.slice(i2, i3)
        if (!isIPNumber(num3)) {
          continue
        }
        const num4 = s.slice(i3, sLength)
        if (isIPNumber(num4)) {
          result.push([num1, num2, num3, num4].join('.'))
        }
      }
    }
  }
  return result
}
console.log(restoreIpAddresses('0000'))
