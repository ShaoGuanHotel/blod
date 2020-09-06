const s1 = 'adc'
const s2 = 'dcda'

var checkInclusion = function (s1, s2) {
  let start = 0
  let end = s1.length
  s1 = [...s1].sort().join('')
  s2 = [...s2]
  while (end <= s2.length) {
    const temp = s2.slice(start, end).sort().join('')
    console.log('>>>>>>>>>>>>> temp >>>>>>>>>>>>>>>>', temp)
    if (temp === s1) {
      return true
    }
    start++
    end++
  }
  return false
}
console.log('>>>>>>>>>>>>> checkInclusion >>>>>>>>>>>>>>>>', checkInclusion(s1, s2))
