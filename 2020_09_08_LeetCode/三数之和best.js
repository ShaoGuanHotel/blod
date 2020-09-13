/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  nums = nums.sort((a, b) => (a - b > 0 ? 1 : -1))
  for (let i = 0; i <= nums.length - 3; i++) {
    let start = i + 1
    let end = i + 2
  }
}
console.log(threeSum([-1, 0, 1, 2, -1, -4]))
