let obj = {
  number: 2,
  str: 'a',
  other: '1a',
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return this.number
      case 'string':
        return this.str
      case 'default':
        return this.other
      default:
        throw new Error()
    }
  },
}
console.log(2 * obj)
console.log(String(obj))
