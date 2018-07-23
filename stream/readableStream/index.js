let fs = require('fs')
let EventEmitter = require('events')

function computeNewHighWaterMark (n) {
  n--;
  n |= n >>> 1;
  n |= n >>> 2;
  n |= n >>> 4;
  n |= n >>> 8;
  n |= n >>> 16;
  n++;
  return n;
}

class ReadableStream extends EventEmitter {
  constructor(path, options) {
    super()
    this.path = path
    this.flags = options.flags || 'r'
    this.encoding = options.encoding || null
    this.autoClose = options.autoClose || true
    this.highWaterMark = options.highWaterMark || 64 * 1024
    this.start = options.start || 0
    this.end = options.end || null
    this.mode = options.mode || 0o666

    // 是否正在读取文件
    this.reading = false
    // 当len=0时，触发readable事件
    this.emitReadable = false
    // 缓存中字节的长度
    this.len = 0
    // 缓存每次读取的内容，格式为[<Buffer />, <Buffer />, ...]
    this.arr = []
    // 文件读取的位置
    this.pos = this.start
    // 是否文件全部读取完
    this.finished = false
    // 打开文件
    this.open()
    // 判断用户是否监听了readable事件
    this.on('newListener', (type) => {
      if (type === 'readable') {
        // 第一次文件读取
        this.read()
      }
    })
  }
  // 打开可读流
  open () {
    fs.open(this.path, this.flags, (err, fd) => {
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
  // 可读流实例调用的方法
  read (n) {

    let buffer = null

    // 如果参数为空且不是在构造函数中调用此函数，n默认按highWaterMark处理
    if (typeof n === 'undefined' && this.pos > this.start) {
      n = this.highWaterMark
    }

    // 如果this.read(8) highWaterMark=3
    if (n > this.len) {
      // 不够读时且文件没有读取完，修改highWaterMark继续读取
      if (!this.finished) {
        this.highWaterMark = computeNewHighWaterMark(n)
        this.reading = true
        this.emitReadable = true
        this._read()
      } else {
        // 否则直接返回缓存数据
        buffer = this.arr.shift()
      }
    }

    // 如果this.read(2) highWaterMark=3 
    if (n > 0 && n <= this.len) {
      buffer = Buffer.alloc(n)
      let current
      let index = 0
      let flag = true
      while (flag && (current = this.arr.shift())) {
        for (let i = 0; i < current.length; i++) {
          buffer[index++] = current[i]
          if (index === n) {
            flag = false
            let other = current.slice(i + 1)
            if (other.length > 0) {
              this.arr.unshift(other)
            }
            this.len -= n
            break
          }
        }
      }
    }

    // 如果缓存区长度为0时，表明可以触发readable事件
    if (this.len === 0) {
      this.emitReadable = true
    }
    // 如果缓存区长度小于水位线时，则进行文件读取
    if (this.len < this.highWaterMark) {
      if (!this.reading) {
        this.reading = true
        this._read()
      }
    }

    // 根据编码方式处理数据
    if (buffer) {
      buffer = this.encoding ? buffer.toString(this.encoding) : buffer
    }
    return buffer
  }
  // 真实读取文件的方法
  _read () {
    // 因为打开文件为异步操作，当读取时文件未打开，可以通过注册一次open事件，打开后执行回调即可拿到this.fd
    if (typeof this.fd !== 'number') {
      this.once('open', () => this._read())
      return
    }

    let howMuchToRead = this.end ? Math.min(this.highWaterMark, this.end - this.pos + 1) : this.highWaterMark
    let buffer = Buffer.alloc(howMuchToRead)
    fs.read(this.fd, buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
      // bytesRead 为文件读取到的长度
      if (bytesRead > 0) {
        // 将读取的内容缓存到arr数组中
        this.arr.push(buffer)
        // 相关变量更新
        this.len += bytesRead
        this.pos += bytesRead
        this.reading = false
        // 缓存后触发实例上用户调用的read函数
        if (this.emitReadable) {
          this.emitReadable = false
          this.emit('readable')
        }
      } else {
        // this.len不等于0且小于this.highWaterMark，需要手动触发一下readable事件
        this.finished = true
        if (this.len) {
          this.emit('readable')
        } else {
          this.emit('end')
        }
      }
    })
  }
  // 关闭可读流
  destory () {
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close')
      })
    }
    this.emit('close')
  }
}

module.exports = ReadableStream