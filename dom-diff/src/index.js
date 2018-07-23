
import { createElement, render, renderDom } from './element'
import diff from './diff'
import patch from './patch'

// 拿到虚拟dom
let virtualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['2']),
  createElement('li', { class: 'item' }, ['3'])
])
console.log('virtualDom:', virtualDom)

let virtualDom2 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['2']),
  createElement('div', { class: 'item' }, ['c'])
])


// 生成真实dom
let el = render(virtualDom)
// console.log(el)

// 插入到页面
renderDom(el, window.app)

let patches = diff(virtualDom, virtualDom2)
console.log('patches:', patches)

patch(el, patches)
// if (module.hot) {
//   module.hot.accept()
// }