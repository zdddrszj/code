const {
  Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
  AsyncSeriesHook
} = require('tapable')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const t = require('@babel/types')
const parser = require('@babel/parser') // babylon
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default

class Compiler extends Tapable {
  constructor (options) {
    super()
    this.options = options
    this.hooks = {
      compile: new SyncHook(['name']),
      afterCompile: new SyncHook(['name']),
      emit: new SyncHook(['name'])
    }
    // 加载所配置的插件
    let { plugins } = options
    plugins.forEach(plugin => {
      plugin.apply(this)
    })
  }
  run () {
    // 确定入口
    let { entry } = this.options
    // 获取当前cwd工作目录
    this.root = process.cwd()
    // 存储所有模块
    this.modules = {}

    // 编译模块
    this.hooks.compile.call('compile-call')
    this.buildModule(path.resolve(this.root, entry), true)
    this.hooks.afterCompile.call('after-compiler-call')

    // 封包
    this.hooks.emit.call('emit-call')
    this.emitFile()
  }
  /**
   * 创建模块
   * @param {*} modulePath 相对路径
   * @param {*} isEntry 是否是入口文件
   */
  buildModule (modulePath, isEntry) {
    let root = this.root

    // 获取源文件内容
    let source = this.getSource(modulePath)

    // 获取相对路径
    let moduleId = '.' + path.sep + path.relative(root, modulePath)
    // 如果是入口文件，存储模块id
    if (isEntry) {
      this.entryId = moduleId
    }
    // 解析source
    let {dependencies, sourceCode} = this.parse(source, path.dirname(modulePath))
    this.modules[moduleId] = sourceCode
    dependencies.forEach(dep => this.buildModule(dep))
  }
  /**
   * 读取源码
   * @param {*} modulePath 相对路径
   */
  getSource (modulePath) {
    let source = fs.readFileSync(modulePath, 'utf8')
    // 处理loader
    source = this.processLoaders(modulePath, source)
    return source
  }
  /**
   * 处理loaders
   * @param {*} modulePath 相对路径
   * @param {*} source 源码
   */
  processLoaders (modulePath, source) {
    let that = this
    let {module:{rules}} = this.options
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].test.test(modulePath)) {
        let loaderUseConfig = rules[i].use
        if (this.isArray(loaderUseConfig)) {
          let index = loaderUseConfig.length - 1
          const runLoader = () => {
            let loaderName = loaderUseConfig[index--] + '.js'
            let paths = this.options.resolveLoader.modules
            for (let k = 0; k < paths.length; k++) {
              let currentPath = path.resolve(that.root, paths[k], loaderName)
              try {
                fs.accessSync(currentPath)
                let loaderFun = require(currentPath)
                source = loaderFun.call(that, source)
                break
              } catch (err) {
                console.log(err)
              }
            }
            if (index < 0) {
              return source
            } else {
              runLoader()
            }
          }
          runLoader()
        } else if (this.isObject(loaderUseConfig)) {
          let loaderName = loaderUseConfig.loader + '.js'
          let paths = this.options.resolveLoader.modules
          for (let k = 0; k < paths.length; k++) {
            let currentPath = path.resolve(that.root, paths[k], loaderName)
            try {
              fs.accessSync(currentPath)
              let loaderFun = require(currentPath)
              source = loaderFun.call(that, source)
              break
            } catch (err) {
              console.log(err)
            }
          }
        }
        // 匹配到后不必匹配其他rules
        break
      }
    }
    return source
  }
  /**
   * 解析并修改源文件
   * @param {*} source 源码
   * @param {*} parentPath 当前文件父路径
   */
  parse (source, parentPath) {
    let root = this.root
    let ast = parser.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression (p) {
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          // 修改路径参数：把文件相对路径改成相对于根目录的相对路径
          let moduleName = node.arguments[0].value
          // moduleName += moduleName.lastIndexOf('.') >-1 ? '' : '.js'
          let moduleId = '.' + path.sep + path.relative(root, path.join(parentPath, moduleName))
          node.arguments = [t.stringLiteral(moduleId)]
          dependencies.push(moduleId)
        }
      }
    })
    let sourceCode = generate(ast).code
    return {dependencies, sourceCode}
  }
  /**
   * 生成chunk
   */
  emitFile () {
    let entryTemplate = fs.readFileSync(path.join(__dirname, 'entry.ejs'), 'utf8')
    let {entryId, modules} = this
    let source = ejs.compile(entryTemplate)({entryId, modules})
    let {output:{path:p,filename}} = this.options
    try {
      fs.accessSync(p)
    } catch (e) {
      fs.mkdirSync(p)
    }
    fs.writeFileSync(path.join(p, filename), source)
  }
  callback (err, source) {
    return source
  }
  isObject (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  }
  isArray (o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  }
}
module.exports = Compiler