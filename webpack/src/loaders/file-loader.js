const { getOptions, interpolateName } = require("loader-utils")
function loader(content) {
  let options = getOptions(this) || {}
  let url = interpolateName(this, options.filename || "[hash]", { content })
  url = url + this.resourcePath.slice(this.resourcePath.lastIndexOf("."))
  this.emitFile(url, content)
  return `module.exports = ${JSON.stringify(url)}`
}
loader.raw = true
module.exports = loader
