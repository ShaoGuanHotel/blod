/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var longestOnes = function (A, K) {
  // 1.
  if (A.every((item) => item === 0) && K === 0) return 0
  let start = 0
  let end = 0
  let zeroIndexs = []
  let max = 0
  const ALength = A.length
  while (end < ALength) {
    end++ // 5. end固定推进
    // 3
    if (zeroIndexs.length > K) {
      // [0,1,2,3,4,5,6,7,8,9,10]
      // [1,1,1,0,0,0,1,1,1,1,0]
      // 5. start指向当前位置后第一个0后面的位置
      // start第一次变化:从 0--> 跳到 4
      start = zeroIndexs.shift() + 1
    } else {
      // 6
      if (max < end - start) {
        max = end - start
      }
    }
    if (!Boolean(A[end])) {
      // 为0
      zeroIndexs.push(end) // 记录0的位置,用于跳转start
    }
  }
  return max
}
