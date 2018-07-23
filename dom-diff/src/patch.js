
import { Element, render, setAttr } from './element.js'

let allPatches
let index = 0
function patch (node, patches) {
  allPatches = patches

  walk(node)
}
function walk (node) {
  let currentPatch = allPatches[index++]
  let childNodes = node.childNodes
  childNodes.forEach(child => {
    walk(child)
  })

  if (currentPatch) {
    doPatch(node, currentPatch)
  }
}
function doPatch (node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTRS':
        for (let key in patch.attrs) {
          let value = path.attrs[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode = patch.newNode
        if (newNode instanceof Element) {
          newNode = render(newNode)
        } else {
          newNode = document.createTextNode(newNode)
        }
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}
export default patch