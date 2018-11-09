// 转换class插件
const babel = require('@babel/core')
const t = require('@babel/types')

const code = `
  class Test {
    constructor(name) {
      this.name=name;
    }
    getName() {
      return this.name;
    }
  }
`
const transformClasses = {
  visitor: {
    ClassDeclaration (path) {
      const node = path.node
      const id = node.id
      let functions = []
      const methods = node.body ? node.body.body : []
      if (!methods || !methods.length) return
      methods.forEach(method => {
        if (method.kind === 'constructor') {
          functions.push(
            t.functionDeclaration(
              node.id, 
              method.params, 
              method.body,
              method.generator,
              method.async
            )
          )
        } else {
          functions.push(
            t.expressionStatement(
              t.assignmentExpression(
                '=', 
                t.memberExpression(
                  t.memberExpression(id, t.identifier('prototype'), method.computed), 
                  method.key, 
                  method.computed
                ), 
                t.functionExpression(null, method.params, method.body, method.generator, method.async)
              )
            )
          )
        }
      })
      if (methods.length === 1) {
        path.replaceWith(functions[0])
      } else {
        path.replaceWithMultiple(functions)
      }
    }
  }
}
const result = babel.transform(code,{
  plugins:[transformClasses]
})
// function Test(name) {
//   this.name = name;
// }

// Test.prototype.getName = function () {
//   return this.name;
// };
console.log(result.code)