// 异步串行钩子函数
// let {AsyncSeriesBailHook} = require('tapable')
class AsyncSeriesBailHook {
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
    let next = (data) => {
      if (i === length || data) {
        callback(data)
        return
      }
      this.hooks[i++](...args, next)
    }
    next()
  }
  tapPromise (name, fn) {
    this.tasks.push(fn)
  }
  promise (...args) {
    let sequence = Promise.resolve()
    let i = 0
    let done = (...args) => {
      sequence = this.tasks[i](...args).then(data => {
        if (data !== undefined || i === this.tasks.length) {
          return Promise.resolve(data)
        } else {
          done(i++)
        }
      })
    }
    done(...args)
    return sequence
  }
}

let queue = new AsyncSeriesBailHook(['name', 'age'])

queue.tapAsync('1', (name, age, callback) => {
  setTimeout(() => {
    console.log('1', name, age)
    callback(true)
  }, 1000)
})
queue.tapAsync('2', (name, age, callback) => {
  setTimeout(() => {
    console.log('2', name, age)
    callback()
  }, 1000)
  
})
queue.tapAsync('3', (name, age, callback) => {
  setTimeout(() => {
    console.log('3', name, age)
    callback(333)
  }, 1000)
})

queue.callAsync('NAME', 'AGE', (data) => {
  console.log('执行结束', data)
})

// queue.tapPromise('1', (name) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('1', name)
//       resolve(111)
//     }, 1000)
//   })
// })
// queue.tapPromise('2', (name) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('2', name)
//       resolve(222)
//     }, 1000)
//   })
// })
// queue.tapPromise('3', (name) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('3', name)
//       resolve()
//     }, 1000)
//   })
// })

// queue.promise('NAME').then((data) => {
//   console.log('执行结束', data)
// }, (err) => {
//   console.log('err', err)
// })