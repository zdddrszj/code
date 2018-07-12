class Observer {
  constructor (data) {
    this.observer(data)
  }
  // 将数据改成 set get 的形式
  observer (data) {
    // 数据不存在或者不是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 将数据一一劫持
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      this.observer(data[key])
    })
  }
  // 定义响应式
  defineReactive (obj, key, value) {
    let that = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newVal) {
        if (newVal !== value) {
          // 调用时是vm.$data.msg，所以this不是observer实例
          // 如果新赋的值是对象，需要继续添加get set方法
          that.observer(newVal)
          value = newVal
          dep.notify()
        }
      }
    })
  }
}

// 发布订阅
class Dep {
  constructor () {
    // 订阅的数组
    this.subs = []
  }
  addSub (watcher) {
    this.subs.push(watcher)
  }
  notify () {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}