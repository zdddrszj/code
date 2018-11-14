// 异步并发钩子函数
// let {AsyncParallelHook} = require('tapable')
class AsyncParallelHook {
  constructor () {
    this.hooks = []
    this.tasks = []
  }
  // 注册监听函数
  tapAsync (name, fn) {
    this.hooks.push(fn)
  }
  // 触发监听函数
  callAsync (...args) {
    let callback = args.pop()
    let i = 0, length = this.hooks.length
    function done () {
      if (++i === length) {
        callback()
      }
    }
    this.hooks.forEach(fn => fn(...args, done))
  }
  tapPromise (name, fn) {
    this.tasks.push(fn)
  }
  promise (...args) {
    let promises = this.tasks.map(fn => fn(...args))
    return Promise.all(promises)
  }
}

// 参数含义：订阅时传入参数，发布时可以收到此参数
let queue = new AsyncParallelHook(['name', 'age'])

// queue.tapAsync('1', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('1', name, age)
//     callback()
//   }, 1000)
// })
// queue.tapAsync('2', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('2', name, age)
//     callback()
//   }, 2000)
  
// })
// queue.tapAsync('3', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('3', name, age)
//     callback()
//   }, 3000)
// })

// queue.callAsync('NAME', 'AGE', (err) => {
//   console.log('执行结束')
// })

queue.tapPromise('1', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1', name)
      resolve(111)
    }, 1000)
  })
})
queue.tapPromise('2', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2', name)
      reject(222)
    }, 2000)
  })
})
queue.tapPromise('3', (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('3', name)
      resolve()
    }, 3000)
  })
})

queue.promise('NAME').then(() => {
  console.log('执行结束')
}, (err) => {
  console.log('err', err)
})