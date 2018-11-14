// 同步钩子函数
// let {SyncHook} = require('tapable')
class SyncHook {
  constructor () {
    this.hooks = []
  }
  // 注册监听函数
  tap (name, fn) {
    this.hooks.push(fn)
  }
  // 触发监听函数
  call (...args) {
    this.hooks.forEach(fn => fn(...args))
  }
}

// 参数含义：订阅时传入参数，发布时可以收到此参数
let queue = new SyncHook(['name', 'age'])

// 监听多次
queue.tap('1', (name, age) => {
  console.log('1', name, age)
})
queue.tap('2', (name, age) => {
  console.log('2', name, age)
})
queue.tap('3', (name, age) => {
  console.log('3', name, age)
})

queue.call('NAME', 'AGE')