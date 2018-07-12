/**
 * 编译
 */
class Compile {
  constructor (el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm

    if (this.el) {
      // 1、先把节点放到fragment片段中
      let fragment = this.node2Fragment(this.el)

      // 2、编译fragment　提取想要的元素节点v-model和文本节点{{msg}}
      this.compile(fragment)

      // 3、处理后在放回页面
      this.el.appendChild(fragment)
    }
  }

  /* 辅助方法 */
  // 是不是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
  // 是不是指令
  isDirective (name) {
    return name.includes('v-')
  }

  /* 核心方法 */
  node2Fragment (el) {
    let fragment = document.createDocumentFragment()
    let child = null
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  // 编译元素 v-model v-text v-html
  compileElement (node) {
    // 取出当前节点属性
    Array.from(node.attributes).forEach(attr => {
      // { v-model, msg }
      let { name, value } = attr
      if (this.isDirective(name)) {
        // this.vm.$data[name] = value
        let [, type] = name.split('-')
        CompileUtil[type](node, this.vm, value)
      }
    })
  }
  // 编译文本
  compileText (node) {
    // 取文本中的内容 {{msg}} {{msg}}
    let text = node.textContent
    let reg = /\{\{([^}])*\}\}/g
    if (reg.test(text)) {
      CompileUtil['text'](node, this.vm, text)
    }
  }
  compile (fragment) {
    let childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node)
        // 迭代
        this.compile(node)
      } else {
        this.compileText(node)
      }
    })
  }
}

CompileUtil = {
  // 文本处理 exp: {{msg}} {{msg}}
  text (node, vm, exp) {
    let updaterFn = this.updater['textUpdater']
    let value = this.getTextVal(vm, exp)

    exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Watcher(vm, args[1], (newVal) => {
        updaterFn && updaterFn(node, this.getTextVal(vm, exp))
      })
    })

    updaterFn && updaterFn(node, value)
  },
  // 输入框处理 exp: v-model
  model (node, vm, exp) {
    let updaterFn = this.updater['modelUpdater']
    // 这里加一个监控 数据变化后，调用watch的cb
    new Watcher(vm, exp, (newVal) => {
      updaterFn && updaterFn(node, this.getVal(vm, exp))
    })
    node.addEventListener('input', (e) => {
      let newVal = e.target.value
      this.setVal(vm, exp, newVal)
    })
    updaterFn && updaterFn(node, this.getVal(vm, exp))
  },
  updater: {
    textUpdater (node, value) {
      node.textContent = value
    },
    modelUpdater (node, value) {
      node.value = value
    }
  },
  getVal (vm, exp) {
    // v-model="a.b"
    exp = exp.split('.')
    return exp.reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  },
  getTextVal (vm, exp) {
    // {{msg}} {{a.b}}
    return exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  setVal (vm, exp, value) {
    // v-model="a.b"
    exp = exp.split('.')
    return exp.reduce((prev, next, currentIndex) => {
      if (currentIndex === exp.length - 1) {
        prev[next] = value
      }
      return prev[next]
    }, vm.$data)
  },
}
