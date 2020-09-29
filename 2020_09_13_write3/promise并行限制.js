class Scheduler {
  queues = []
  pendingNumber = 0
  maxPendingNumber = 2
  add(promiseCreator) {
    this.queues.push(promiseCreator)
  }
  request() {
    if (this.queues.length === 0) return
    if (this.pendingNumber >= this.maxPendingNumber) return
    this.pendingNumber++
    this.queues
      .shift()()
      .then((value) => {
        this.pendingNumber--
        this.request()
      })
  }
  start() {
    for (let i = 0; i < this.maxPendingNumber; i++) {
      this.request()
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

const scheduler = new Scheduler()

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

scheduler.start()
