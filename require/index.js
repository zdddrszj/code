/**
 * node中 require exports 实现原理
 */
let path = require('path')
let fs = require('fs')
let vm = require('vm')

function Module(filename) {
  // 默认模块未加载过
  this.loaded = false
  // 模块的绝对路径
  this.filename = filename
  // 模块导出的结果
  this.exports = {}
}

// 模块加载函数
Module.prototype.load = function () {
  // 取到文件名称后缀
  let extname = path.extname(this.filename)
  // 根据不同后缀读取文件内容
  Module._extensions[extname](this)
  // 标记模块已加载
  this.loaded = true
}

// 模块缓存对象
Module._cache = {}

// 文件后缀
Module._extensions = ['.js', '.json']

// json格式文件读取方式
Module._extensions['.json'] = function (module) {
  let content = fs.readFileSync(module.filename, 'utf8')
  module.exports = JSON.parse(content)
}

// 创建执行js沙箱环境时需要
Module.wrapper = ['(function (exports, require, module){', '\n})']

// js代码拼接
Module.wrap = function (content) {
  return Module.wrapper[0] + content + Module.wrapper[1]
}

// js格式文件读取方式
Module._extensions['.js'] = function (module) {
  // 读取文件
  let content = fs.readFileSync(module.filename, 'utf8')
  // 把文件内容放到闭包函数中
  let script = Module.wrap(content)
  // 创建不影响外界上下文的沙箱环境
  let fn = vm.runInThisContext(script)
  // 让闭包函数执行，同时给函数中export require module变量赋值
  fn.call(module.exports, module.exports, req, module)
}

Module._resolveFilename = function (p) {
  p = path.join(__dirname, p)
  // 如果文件有后缀
  if (!/\.\w+$/.test(p)) {
    // 添加扩展名
    for (let i = 0; i < Module._extensions.length; i++) {
      // 拼出一个路径
      let filePath = p + Module._extensions[i]
      try {
        // 判断文件是否存在
        fs.accessSync(filePath)
        // 返回文件路径
        return filePath
      } catch (e) {
        // 如果accessSync方法报错，说明文件不存在，则抛出文件未找到异常
        if (i > Module._extensions.length) {
          throw new Error('module not found')
        }
      }
    }
  } else {
    // 否则直接返回文件路径
    return p
  }
}


function req (path) {
  // 先要根据路径变成一个绝对路径
  let filename = Module._resolveFilename(path)
  // 文件路径唯一
  if (Module._cache[filename]) {
    // 如果加载过 直接把加载过的结果返回
    return Module._cache[filename].exports
  }
  // 通过文件名创建一个模块
  let module = new Module(filename)
  // 加载模块，根据不同后缀加载不同内容
  module.load()
  // 进行模块缓存
  Module._cache[filename] = module
  // 返回最后的结果
  return module.exports
}

// 测试
let str = req('./example')
console.log(str)