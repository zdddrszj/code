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
  return __webpack_require__(".\src\index.js");
})
({
  
    ".\src\index.js":
    (function(module, exports, __webpack_require__) {
      eval(`let a = __webpack_require__(".\\src\\a.js");

console.log(a);

__webpack_require__(".\\src\\a.less");`);
    }),
  
    ".\src\a.js":
    (function(module, exports, __webpack_require__) {
      eval(`module.exports = '111';`);
    }),
  
    ".\src\a.less":
    (function(module, exports, __webpack_require__) {
      eval(`let style = document.createElement('style');
style.innerHTML = "body {  color: red;}header {  width: 100px;  height: 110px;}";
document.head.appendChild(style);`);
    }),
  
})