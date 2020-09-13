// https://leetcode-cn.com/problems/simplify-path/
/**
 * @param {string} path
 * @return {string}
 */
const path = '/a/b/c/d/././..'
var simplifyPath = function (path) {
  path = path.replace(/\/{2,}/g, '/')
  const paths = []
  const Filter = (item) => !['', '.'].includes(item)
  path
    .split('/')
    .filter(Filter)
    .forEach((item) => {
      if (item === '..') {
        paths.pop()
      } else {
        paths.push(item)
      }
    })
  return `/${paths.join('/')}`
}
simplifyPath(path)
