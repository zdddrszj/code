// 转换箭头函数插件
const babel = require("@babel/core")
const t = require("@babel/types")

const source = "[1, 2, 3].map((n) => n + 1);"

const transformArrowFunctions = {
  visitor: {
    ArrowFunctionExpression (path) {
      const node = path.node
			const functionExpression = t.functionExpression(
        null, 
        node.params, 
        t.blockStatement([t.returnStatement(node.body)]), 
        node.generator, 
        node.async
      )
      path.replaceWith(functionExpression)
    }
  }
};
const result = babel.transform(source, {
  plugins: [transformArrowFunctions]
})
// [1, 2, 3].map(function (n) {
//   return n + 1;
// });
console.log(result.code)
