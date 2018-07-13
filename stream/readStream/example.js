let fs = require('fs')
let ReadStream = require('./index')

let rs = new ReadStream('./1.txt', {
  highWaterMark: 2,
  autoClose: true,
  flags: 'r',
  start: 0,
  end: 5,
  encoding: 'utf8'
})

rs.on('open', function () {
  console.log('open')
})

rs.on('data', function (data) {
  console.log(data);
  rs.pause()
})

rs.on('end', function () {
  console.log('end')
})

rs.on('close', function () {
  console.log('close')
})

rs.on('error', function (err) {
  console.log(err)
})

setInterval(() => {
  rs.resume()
}, 1000)