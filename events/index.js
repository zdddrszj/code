/**
 * node中EventEmitter模块实现
 */
function EventEmitter() {
  // 这样创建的对象没有链__proto__
  this._events = Object.create(null)
}

EventEmitter.defaultMaxListeners = 10

EventEmitter.prototype.eventNames = function () {
  return Object.keys(this._events)
}

EventEmitter.prototype.setMaxListeners = function (count) {
  this.count = count
}

EventEmitter.prototype.getMaxListeners = function () {
  return this.count || EventEmitter.defaultMaxListeners
}

EventEmitter.prototype.addListener = EventEmitter.prototype.on = function (eventName, callback, flag) {
  if (!this._events) this._events = Object.create(null)
  if (eventName !== 'newListener') {
    if (this._events['newListener'] && this._events['newListener'].length) {
      this._events['newListener'].forEach(fn => fn(eventName))
    }
  }
  if (this._events[eventName]) {
    if (flag) {
      this._events[eventName].unshift(callback)
    } else {
      this._events[eventName].push(callback)
    }
  } else {
    this._events[eventName] = [callback]
  }
  if (this._events[eventName].length - 1 === this.getMaxListeners()) {
    console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this._events[eventName].length} ${eventName} listeners added. Use emitter.setMaxListeners() to increase limit`)
  }
}

EventEmitter.prototype.emit = function (eventName, ...args) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => fn.call(this, ...args))
  }
}

EventEmitter.prototype.removeListener = function (eventName, callback) {
  this._events[eventName] = this._events[eventName].filter(fn => fn !== callback && fn.cb !== callback)
}

EventEmitter.prototype.removeAllListeners = function (eventName) {
  this._events[eventName] = []
}

EventEmitter.prototype.once = function (eventName, callback, flag) {
  let one = (...args) => {
    callback(...args)
    // 绑定一次后删除
    this.removeListener(eventName, one)
  }
  // cb是自定义属性：once时已经更改callback为one，所以在调用once函数后面接着调用removeListener时匹配不到原来的callback，所以filter时根据cb标志位来过滤
  one.cb = callback
  this.on(eventName, one, flag)
}

EventEmitter.prototype.prependListener = function (eventName, callback) {
  this.on(eventName, callback, true)
}

EventEmitter.prototype.prependOnceListener = function (eventName, callback) {
  this.once(eventName, callback, true)
}

module.exports = EventEmitter