

// 创建虚拟dom
function createElement (type, props, children) {
  return new Element(type, props, children)
}

// 将虚拟dom渲染成真实dom
function render (eleObj) {
  let el = document.createElement(eleObj.type)
  for (let key in eleObj.props) {
    // 根据不同属性类型设置属性
    setAttr(el, key, eleObj.props[key])
  }
  eleObj.children.forEach(child => {
    if (child instanceof Element) {
      child = render(child)
    } else {
      child = document.createTextNode(child)
    }
    el.appendChild(child)
  })
  return el
}

// 将真实dom放到页面
function renderDom (el, target) {
  target.appendChild(el)
}

// 虚拟dom元素类
class Element {
  constructor (type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

// 属性设置
function setAttr (node, key, value) {
  switch (key) {
    case 'value': 
      if (node.tagName.toUpperCase() === 'INPUT' ||node.tagName.toUpperCase() === 'TEXTAREA') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    case 'style': 
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
      break
  }
}
export { createElement, render, renderDom, Element, setAttr }
