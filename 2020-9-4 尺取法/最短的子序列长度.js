// 1.给定一个序列，使得其和大于或等于S，求最短的子序列长度。
const nums = [2, 3, 1, 2, 4, 3]
let step = 0
function minSubArrayLen(s, nums) {
  const sumFn = (arr) => (arr.length ? arr.reduce((a, t) => (t += a)) : 0)
  // 1. 特殊情况处理
  if (sumFn(nums) < s) return 0
  let min = nums.length
  let start = 0
  let end = 0
  // 边界处理
  while (end <= nums.length) {
    // 2.区间截取
    const temp = nums.slice(start, end)
    // 3.结合otherParam判断
    const total = sumFn(temp)
    // 4.何时推进
    if (total >= s) {
      // 6.更新minOrMax 
      if (min > temp.length) {
        min = temp.length
      }
      // 和大于=s则end静止,推进start,同时因为区间变小,更新返回值
      // [2,3,1,2]，则end不动，指向2；start推进一步，指向第一个3
      // 5.推进start
      start++
    } else {
      // 5.和小于s,推进end,start静止
      end++
    }
  }
  return min
}
console.log('minSubArrayLen(7, nums)  ', minSubArrayLen(7, nums))