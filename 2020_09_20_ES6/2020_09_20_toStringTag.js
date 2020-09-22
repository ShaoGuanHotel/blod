class Hotel {
  get [Symbol.toStringTag]() {
    return 'Hotel'
  }
  constructor({ name, age }) {
    Object.assign(this, { name, age })
  }
  hello() {
    console.log(this.name, this.age)
  }
}
const h = new Hotel({ name: 'hetao', age: 20 })
h.hello()
console.log('>>>>>>>>>>>>> Object.prototype.toString.call(h) >>>>>>>>>>>>>>>>', Object.prototype.toString.call(h))
console.log('>>>>>>>>>>>>>  >>>>>>>>>>>>>>>>', h.toString())

function* test() {}
console.log(test[Symbol.toStringTag])
var obj=()=>{}
console.log(obj[Symbol.toStringTag])
