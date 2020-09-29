function myInstanceOf(L, R) {
  if (L === null) return false
  const baseType = ['string', 'boolean', 'symbol', 'undefined', 'number']
  if (baseType.includes(typeof L)) return false
  const rp = R.prototype
  while (true) {
    L = L.__proto__
    if (L === null) {
      return false
    }
    if (L === rp) {
      return true
    }
  }
}

const obj = Symbol()
console.log(myInstanceOf(obj, Symbol))
console.log(obj instanceof Symbol)
