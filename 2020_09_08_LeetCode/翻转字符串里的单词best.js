/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  s = s.trim()
  let start = s.length - 1
  let end = s.length
  const res = []
  while (start >= 0) {
    if (s[start] === ' ') {
      if (end - start > 1) {
        res.push(s.slice(start + 1, end))
      }
      end = start
    }
    start--
  }
  res.push(s.slice(start + 1, end))
  return res.join(' ')
}
reverseWords('the sky is blue')
