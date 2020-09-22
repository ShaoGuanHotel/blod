Number.prototype[Symbol.iterator] = function* () {
  let value = this.valueOf()
  while (value--) {
    yield this.valueOf() - value
  }
}
var num = 6
console.log([...num])
num.forEach(a=>console.log(a))
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values)
console.log(Map.prototype[Symbol.iterator] === Map.prototype.entries)
