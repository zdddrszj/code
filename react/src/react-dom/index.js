
// 主方法
function render (vnode, container) {
  container.appendChild(_render(vnode))
}

// 把虚拟dom渲染成真是dom
function _render (vnode) {
  console.log(vnode)
  if (util.isString(vnode) || util.isNumber(vnode)) {
    return document.createTextNode(vnode)
  }
  let { type, props, children } = vnode
  // 如果type是函数，说明是组件 函数组件 类组件
  if (util.isFunction(type)) {
    // 创建组件,给组件添加render方法
    let comp = createComponent(type, props)
    comp.props = props
    // 渲染组件
    let dom = renderComponent(comp)
    comp.dom = dom
    return dom
  }

  let element = document.createElement(type)

  if (props) {
    for (let key in props) {
      setAttribute(element, key, props[key])
    }
  }

  if (children) {
    children.forEach(child => {
      // 如果child是一个数组（map结构）
      if (util.isArray(child)) {
        return child.forEach(c => render(c, element))
      }
      render(child, element)
    })
  }

  return element
}

function setAttribute (element, key, value) {
  if (key === 'className') {
    key = 'class'
  }
  // 绑定样式
  if (key === 'style') {
    if (util.isObject(value)) {
      for (let k in value) {
        element['style'][k] = value[k]
      }
    }
    return
  }

  // 绑定事件
  if (key.startsWith('on')) {
    key = key.toLowerCase()
    element[key] = value
    return
  }

  element.setAttribute(key, value)
}

function createComponent (comp, props) {
  // 类组件
  if (comp.prototype.render) {
    comp = new comp(props)
  } else {
    // 函数组件: 调用render方法让函数执行，
    // return React.createElement(
    //   "h1",
    //   null,
    //   "hello ",
    //   props.value
    // )
    comp.render = function () {
      return comp(props)
    }
  }

  return comp
}
export function renderComponent (comp) {
  let dom
  if (!comp.dom) {
    if (comp.componentWillMount) {
      comp.componentWillMount()
    }
  }
  // 渲染真实dom
  dom = _render(comp.render())
  if (!comp.dom) {
    if (comp.componentDidMount) {
      comp.componentDidMount()
    }
  }
  return dom
}

let ReactDom = {
  render
}

function isType (type) {
  return function (content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`
  }
}

let util = {}
let arr = ['String', 'Number', 'Object', 'Array', 'Function', 'Null']
arr.forEach(t => {
  util['is' + t] = isType(t)
})

export default ReactDom
