/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  if (nums.length < 3) return []
  const map = {}
  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + i; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const temp = [nums[i], nums[j], nums[k]].sort()
          console.log(temp.join(','))
          if (map[temp.join(',')] === undefined) {
            map[temp.join(',')] = temp
          }
        }
      }
    }
  }
  return Object.values(map)
}
console.log(threeSum([-1, 0, 1, 2, -1, -4]))
