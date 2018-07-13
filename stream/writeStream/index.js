let fs = require('fs')
let EventEmitter = require('events')

class WriteStream extends EventEmitter {
  constructor (path, options) {
    super()
    this.path = path
    this.flags = options.flags || 'w'
    this.highWaterMark = options.highWaterMark || 16 * 1024
    this.encoding = options.encoding || 'utf8'
    this.start = options.start || 0
    this.end = options.end || null
    this.autoClose = options.autoClose || true
    this.mode = options.mode || 0o666

    // 写入的位置
    this.pos = this.start
    // 是否正在写入
    this.writing = false
    // 是否需要触发drain事件
    this.needDrain = false
    // 缓存每次调用write时的数据对象
    this.arr = []
    // arr数组中chunk的总长度
    this.len = 0

    this.open()
  
  }
  open () {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        this.emit('error')
        if (this.autoClose) {
          this.destory()
        }
        return
      }
      this.fd = fd
      this.emit('open')
    })
  }
  write (chunk, encoding = this.encoding, callback) {

    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    this.len += chunk.length
    this.needDrain = this.highWaterMark <= this.len

    // 如果正在写，则放到缓存中
    if (this.writing) {
      this.arr.push({
        chunk,
        encoding,
        callback
      })
    } else {
      this.writing = true
      this._write(chunk, encoding, () => {
        callback && callback()
        this.clearBuffer()
      })
    }
    // write的返回值
    return !this.needDrain
  }
  _write (chunk, encoding, callback) {
    if (typeof this.fd !== 'number') {
      this.once('open', () => this._write(chunk, encoding, callback))
      return
    }
    fs.write(this.fd, chunk, 0, chunk.length, (err, bytesWritten) => {
      this.pos += bytesWritten
      this.len -= bytesWritten
      callback()
    })
  }
  clearBuffer () {
    let buf = this.arr.shift()
    if (buf) {
      this._write(buf.chunk, buf.encoding, () => this.clearBuffer())
    } else {
      this.writing = false
      this.needDrain =  false
      this.emit('drain')
    }
  }
  destory () {
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close')
      })
    }
    this.emit('close')
  }
}
module.exports = WriteStream