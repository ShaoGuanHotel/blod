/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var longestOnes = function (A, K) {
  let start = 0
  let end = 0
  let max = 0
  const ALength = A.length
  const Zero = (num) => !Boolean(num)
  while (end < ALength) {
    // 2
    const temp = A.slice(start, end)
    // 3
    const numberOf0 = temp.filter(Zero).length

    // 4
    if (numberOf0 > K) {
      start++ // 5
      if (max < end - start + 1) {
        max = end - start + 1 // 6
      }
    } else {
      end++ // 5
    }
  }
  return max
}
