#! /usr/bin/env node
let entry = './src/index.js'
let output = './dist/main.js'
let path = require('path')
let fs = require('fs')
let Modules = []

// 处理loader
let styleLoader = (source) => {
  return `
    let style = document.createElement('style');
    style.innerText = ${JSON.stringify(source).replace(/\\r\\n/g, '')};
    document.head.appendChild(style);
  `
}

// 处理require文件
let script = fs.readFileSync(entry, 'utf8')
script = script.replace(/require\(['"](.+?)['"]\)/g, function () {
  let name = path.join('./src/', arguments[1])
  let content = fs.readFileSync(name, 'utf8')
  if (/\.css$/.test(name)) {
    content = styleLoader(content)
  }
  Modules.push({
    name, content
  })
  return `__webpack_require__('${name}')`
})

// 处理模板
let ejs = require('ejs')
let template = `
(function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }
  return __webpack_require__("<%-entry%>");
})
({
  "<%-entry%>":
  (function(module, exports, __webpack_require__) {
  eval(\`<%-script%>\`);
  })
  <%for(let i = 0; i < Modules.length; i++){
    let module = Modules[i];%>,
    "<%-module.name%>":
    (function(module, exports, __webpack_require__) {
    eval(\`<%-module.content%>\`);
    })
  <%}%>
});
`
// 替换后的代码
let source = ejs.render(template, {
  entry,
  script,
  Modules
})
// 输出文件
fs.writeFileSync(output, source)
