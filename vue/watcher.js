// 需要变化的那个元素添加观察者，当数据变化后，执行对应的方法
class Watcher {
  // vm.$watch(vm.$data, 'a', ()=>{})
  constructor (vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    // 先存储老值
    this.value = this.get()
  }
  get () {
    Dep.target = this
    let val = this.getVal(this.vm, this.exp)
    Dep.target = null
    return val
  }
  update () {
    let newVal = this.getVal(this.vm, this.exp)
    let oldVal = this.value
    if (newVal !== oldVal) {
      this.cb(newVal, oldVal)
    }
  }
  getVal (vm, exp) {
    exp = exp.split('.')
    return exp.reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  }
}