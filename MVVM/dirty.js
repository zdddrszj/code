// dirty 脏值检查 先保留一个原有的值　有一个新值　
// 上一个例子是不停的监控新放的值，

function Scope () {
  //　存放空间
  this.$watchers = []
}
Scope.prototype.$watch = function (exp, fn) {
  this.$watchers.push({
    fn,
    last: this[exp],
    exp
  })
}
Scope.prototype.$apply = function () {
  this.$digest()
}
// 脏值检测
Scope.prototype.$digest = function () {
  // 至少走一次
  let dirty = true
  let count = 9
  do {
    dirty = this.$digestOne()
    if (count === 0) {
      throw new Error('$digest 10 iterations reached, Aborting')
    }
  } while (dirty && count--)
}
Scope.prototype.$digestOne = function () {
  let dirty = false
  this.$watchers.forEach(watcher => {
    let oldVal = watcher.last
    let newVal = this[watcher.exp]
    if (newVal !== oldVal) {
      watcher.fn(newVal, oldVal)
      watcher.last = newVal
      // 调用了fn可能更改数据
      dirty = true
    }
  })
  return dirty
}

let scope = new Scope()
scope.name = '11'
scope.$watch('name', function (newVal, oldVal) {
  console.log(newVal, oldVal)
  scope.name = Math.random()
})
scope.$watch('age', function (newVal, oldVal) {
  scope.name = '333'
})
scope.age = '0'
scope.$apply()

console.log(scope.name)
