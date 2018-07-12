let fs = require('fs')
let ReadableStream = require('./index.js')
let rs = new ReadableStream('./1.txt', {
  autoClose: true,
  start: 0,
  flags: 'r',
  encoding: 'utf8',
  highWaterMark: 3
})

// rs.on('readable', () => {
//   let r = rs.read(2)
//   // 输出结果为 12
//   console.log(r)
// })

// rs.on('readable', () => {
//   let r = rs.read(3)
//   // 输出结果为 123 456 789 null 0
//   console.log(r)
// })

rs.on('readable', () => {
  let r = rs.read(8)
  // 输出结果为 null 12345678 90
  console.log(r)
})