
let loaderUtils=require("loader-utils")
function loader(source) {} 
loader.pitch = function (request) {
  let style = `
    var style = document.createElement("style");
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + request)});
    document.head.appendChild(style);
  `
  return style
}
module.exports = loader