const less = require('less')

function loader (source) {
  let css = ''
  less.render(source, (err, result) => {
    css = result.css
  })
  return css.replace(/\n/g, '')
}

module.exports = loader