const less = require('less')

function loader (source) {
  less.render(source, (err, result) => {
    this.callback(err, result.css)
  })
}

module.exports = loader