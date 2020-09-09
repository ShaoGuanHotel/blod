/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i]
    if (map.has(diff)) {
      return [map.get(diff), i]
    } else {
      map.set(nums[i], i)
    }
  }
  return null
}
console.log(twoSum([3, 2, 4], 6))
