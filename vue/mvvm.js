/**
 * 主函数
 */
class MVVM {
  constructor (options) {
    // 首先把后续需要的东西挂载到实例
    this.$el = options.el
    this.$data = options.data

    if (this.$el) {
      // 数据劫持
      new Observer(this.$data)
      // 将vm.$data.msg代理到vm.msg
      this.proxy(this.$data)
      // 编译模板
      new Compile(this.$el, this)
    }
  }
  proxy (data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get () {
          return data[key]
        },
        set (newVal) {
          data[key] = newVal
        }
      })
    })
  }
}
