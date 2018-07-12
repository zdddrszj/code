import { renderComponent } from '../react-dom'
// 创建元素
function createElement (type, props, ...children) {
  // console.log(type, props, children)
  return { type, props, children }
}

class Component {
  constructor (props) {
    this.props = props
    this.state = {}
  }
  setState (newState) {
    Object.assign(this.state, newState)
    let old = this.dom
    let newEle = renderComponent(this)
    // dom-diff
    old.parentNode.replaceChild(newEle, old)
    // 更新当前实例的dom
    this.dom = newEle
  }
}

let React = {
  createElement,
  Component
}

export default React
