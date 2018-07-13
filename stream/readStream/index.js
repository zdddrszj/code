let EventEmitter = require('events')
let fs = require('fs')

class ReadStream extends EventEmitter {
  constructor(path, options) {
    super()
    this.path = path
    this.autoClose = options.autoClose || true
    this.flags = options.flags || 'r'
    this.encoding = options.encoding || null
    this.start = options.start || 0
    this.end = options.end || null
    this.highWaterMark = options.highWaterMark || 64 * 1024
    this.mode = options.mode || 0o666
    // 读取的位置
    this.pos = this.start

    // 是否是流动模式
    this.flowing = null
    // 读取到的内容
    this.buffer = Buffer.alloc(this.highWaterMark)

    // 打开文件
    this.open()

    this.on('newListener', (type) => {
      // 用户监听了data事件，就开始读取
      if (type === 'data') {
        this.flowing = true
        // 开始读取文件
        this.read()
      }
    })
  }
  // 打开文件
  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit('error', err)
        if (this.autoClose) {
          // 触发close事件
          this.destory()
        }
        return
      }
      this.fd = fd
      // 触发open事件
      this.emit('open')
    })
  }
  // 读取文件
  read() {
    // on('end')后不能继续读取了
    if (this.closed) {
      return
    }

    // 由于open事件是异步的，此时this.fd可能没有值
    if (typeof this.fd !== 'number') {
      this.once('open', () => this.read())
      return
    }

    // 开始读取文件
    let howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.pos + 1) : this.highWaterMark
    fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
      if (err) {
        this.emit('error', err)
        if (this.autoClose) {
          // 触发close事件
          this.destory()
        }
        return
      }
      if (bytesRead > 0) {
        this.pos += bytesRead
        let r = this.buffer.slice(0, bytesRead)
        r = this.encoding ? r.toString(this.encoding) : r
        this.emit('data', r)

        // 继续读取
        if (this.flowing) {
          this.read();
        }
      } else {
        this.closed = true
        this.emit('end')
        this.destory()
      }
    })
  }
  // 销毁
  destory() {
    // 如果文件已经打开
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close')
      })
    }
    this.emit('close')
  }
  // 停止
  pause() {
    this.flowing = false
  }
  // 继续
  resume() {
    this.flowing = true
    this.read()
  }
  // 管道流
  pipe(dest) {
    this.on('data', (data) => {
      let flag = dest.write(data)
      if (!flag) {
        this.pause()
      }
    })
    dest.on('drain', () => {
      this.resume()
    })
    this.on('end', () => {
      this.destroy();
    })
  }
}
module.exports = ReadStream