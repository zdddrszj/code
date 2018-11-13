const loaderUtils = require('loader-utils')
const validate = require('schema-utils')
// 用来验证options的合法性
const schema = {
  "type": "object",
  "property": {
    "op": {
      "type": "string"
    }
  }
}
// source就是接收到的源文件的内容
module.exports = function (source) {
  const options = loaderUtils.getOptions(this)
  validate(schema, options, 'log-loader')
  console.log('log-loader')
  // 把loader改为异步，任务完成后需要手工执行callback
  // var callback = this.async()
  // callback(null, source)
  return source
}