
let Koa = require('./application')

let app = new Koa()

let fn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('---')
    }, 1000)
  })
}

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  let r = await fn()
  console.log(r)
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  await next()
  console.log(6)
})

app.use((ctx, next) => {

  // ctx.request.req = ctx.req = req
  // ctx.request 是koa自己封装的
  // 用ctx代理ctx.request
  // console.log(ctx.req.url)
  // console.log(ctx.request.url)
  // console.log(ctx.request.req.url)
  // console.log(ctx.url)

  // console.log(ctx.req.path) // undefined
  // console.log(ctx.request.path) // /
  // console.log(ctx.request.req.path) // undefined
  // console.log(ctx.path) // /

  ctx.body = 'hello'
})

let server = app.listen(3000, 'localhost', function () {
	console.log(`app is listening at http://${server.address().address}:${server.address().port}`)
})