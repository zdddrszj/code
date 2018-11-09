// babylon7
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default

const code = "function ast(){}"
const ast = parser.parse(code)

let indent = 0
function pad() {
  return " ".repeat(indent)
}
traverse(ast, {
  enter(path, state) {
    console.log(pad() + path.type)
    if (path.type == "Identifier") {
      path.node.name = "ast_rename"
    }
    indent += 2
  },
  exit(path) {
    indent -= 2
    console.log(pad() + path.type)
  }
})
const result = generate(ast)

// function ast_rename() {}
console.log(result.code) 
