/**
 * express实现原理
 */
let http = require('http')
let url = require('url')

function createApplication () {
  // app是一个监听函数
  let app = function (req, res) {
    // 当前请求方法
    let m = req.method.toLocaleLowerCase()
    // 当前请求路径
    let {
      pathname
    } = url.parse(req.url, true)
    // 迭代次数索引
    let index = 0
    // 用next代替for循环
    function next(err) {
      // 如果全部路由数组都不满足，则返回找不到
      if (index === app.routes.length) {
        return res.end(`can not ${m} ${pathname}`)
      }
      if (err) {
        res.end(err)
        if (handler.length === 4) {
          handler(err, req, res, next)
        } else {
          next(err)
        }
      } else {
        // 处理中间件
        let { method, path, handler } = app.routes[index++]
        if (method === 'middle') {
          // 如果该中间件path是/，匹配全部请求，执行回调；如果相等，执行回调；如果该中间件path被包含在当前请求url中，也执行回调
          if (path === '/' || path === pathname || pathname.startsWith(path + '/')) {
            handler(req, res, next)
          } else {
            next()
          }
        } else {
          if ((path === pathname || path === '*') && (method === m || method === 'all')) {
            handler(req, res, next)
          } else {
            next()
          }
        }
      }
    }
    next()
  }
  // 存储所有的请求，以便监听函数调用
  app.routes = []
  // http.METHODS 获取RESTFUL所有方法
  http.METHODS.forEach(method => {
    method = method.toLocaleLowerCase()
    app[method] = function (path, handler) {
      let layer = {
        method,
        path,
        handler
      }
      app.routes.push(layer)
    }
  })
  // 如果没有匹配成功，最终执行all函数所存储的回调
  app.all = function (path, handler) {
    let layer = {
      method: 'all', // 表示全部匹配
      path,
      handler
    }
    app.routes.push(layer)
  }
  // 中间件：参数可以传path，也可以不传，默认'/'
  app.use = function (path, handler) {
    if (typeof handler !== 'function') {
      handler = path
      path = '/'
    }
    let layer = {
      method: 'middle',
      path,
      handler
    }
    app.routes.push(layer)
  }
  // 封装一下基本参数
  app.use(function (req, res, next) {
    let { pathname, query } = url.parse(req.url, true)
    req.path = pathname
    req.query = query
    req.hostname = req.headers['host'].split(':')[0]
    next()
  })
  app.listen = function () {
    let server = http.createServer(app)
    // arguments就是参数(3000, 'localhost', function () {})
    server.listen(...arguments)
    return server
  }
  return app
}
module.exports = createApplication
