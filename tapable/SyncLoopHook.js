// 同步钩子函数
// let {SyncLoopHook} = require('tapable')
class SyncLoopHook {
  constructor () {
    this.hooks = []
  }
  // 注册监听函数
  tap (name, fn) {
    this.hooks.push(fn)
  }
  // 触发监听函数
  call (...args) {
    this.hooks.forEach(fn => {
      let ret=true
      do {
        ret = fn(...args)
      }while(!(ret === undefined))
    });
  }
}

// 参数含义：订阅时传入参数，发布时可以收到此参数
let queue = new SyncLoopHook(['name'])

let count = 1
queue.tap('1', (name) => {
  console.log('1', name)
  if (count-- > 0) {
    return 0
  } else {
    return
  }
})
let count1 = 1
queue.tap('2', (name) => {
  console.log('2', name)
  if (count1-- > 0) {
    return 0
  } else {
    return
  }
})

queue.call('NAME')