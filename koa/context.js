

let proto = {

}

function defineGetter (property, name) {
  proto.__defineGetter__(name, function () {
    return this[property][name]
  })
}

function defineSetter (property, name) {
  proto.__defineSetter__(name, function (value) {
    this[property][name] = value
  })
}

defineGetter('request', 'url')
defineGetter('request', 'path')

defineGetter('response', 'body')
defineSetter('response', 'body')

module.exports = proto