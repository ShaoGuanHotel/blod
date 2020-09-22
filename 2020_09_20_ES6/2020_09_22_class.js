class A {
  constructor(name) {
    this.name = name
  }
  a() {
    console.log(this.name, 'a')
  }
  b() {
    console.log(this.name, 'b')
  }
}

class B extends A {
  constructor(name) {
    super(name)
    this.name = name + 'b'
  }
  c() {
    console.log(this.name, 'c')
  }
}
