function async2generator(genFn) {
  if (typeof genFn !== 'function') {
    throw new TypeError('not a function')
  }
  return function (...args) {
    // 非generator
    if (genFn.constructor.name === 'GeneratorFunction') {
      return Promise.resolve(genFn.apply(this, args))
    }
    const gen = genFn.apply(this, args)
    return new Promise((resolve, reject) => {
      function step(){}
    })
  }
}

console.log(new Function('return this')() === globalThis)
