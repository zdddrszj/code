let fs = require('fs')
let WriteStream = require('./index')

process.chdir(__dirname)
let ws = new WriteStream ('./1.txt', {
  flags: 'w',
  mode: 0o666,
  highWaterMark: 3,
  start: 0,
  autoClose: true,
  encoding: 'utf8'
})

let i = 0
function write() {
  let flag = true
  while (i < 10 && flag) {
    flag = ws.write(i++ + '','utf8', () => {
      console.log('写入成功')
    })
  }
}
ws.on('drain', function () {
  console.log('drain抽干')
  write()
})
write()