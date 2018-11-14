// 同步钩子函数
// let {SyncWaterfallHook} = require('tapable')
class SyncWaterfallHook {
  constructor () {
    this.hooks = []
  }
  // 注册监听函数
  tap (name, fn) {
    this.hooks.push(fn)
  }
  // 触发监听函数
  call (...args) {
    this.hooks.reduce((prev, next) => {
      return next(prev)
    }, ...args)
  }
}

// 参数含义：订阅时传入参数，发布时可以收到此参数
let queue = new SyncWaterfallHook(['name'])

// 监听多次
queue.tap('1', (name) => {
  console.log('1', name)
  return 1
})
queue.tap('2', (name) => {
  console.log('2', name)
  return '2'
})
queue.tap('3', (name) => {
  console.log('3', name)
})

queue.call('NAME')