
let http = require('http')
let request = require('./request')
let response = require('./response')
let context = require('./context')

class Koa {
  constructor () {
    this.context = context
    this.request = request
    this.response = response
    this.middlewares = []
  }
  use (cb) {
    this.middlewares.push(cb)
  }
  compose (ctx, middlewares) {
    function next (index) {
      if (index === middlewares.length) {
        return Promise.resolve()
      }
      let middleware = middlewares[index]
      return Promise.resolve(middleware(ctx, () => next(index + 1)))
    }
    return next(0)
  }
  handleRequest (req, res) {
    res.statusCode = 404
    let ctx = this.createContext(req, res)
    // 组合后的中间件，且是一个promise
    let composeMiddleware = this.compose(ctx, this.middlewares)
    composeMiddleware.then(() => {
      let body = ctx.body
      if (typeof body === 'undefined') {
        res.end('Not Fount')
      } else if (typeof body === 'string') {
        res.end(body)
      }
    })
  }
  createContext (req, res) {
    // ctx拿到context的值，但是不影响context
    let ctx = Object.create(this.context)
    ctx.request = Object.create(this.request)
    ctx.response = Object.create(this.response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }
  listen () {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...arguments)
    return server
  }
}

module.exports = Koa