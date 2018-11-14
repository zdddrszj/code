class EmitWebpackPlugin {
  apply (compiler) {
    compiler.hooks.emit.tap('EmitWebpackPlugin', (option) => {
      console.log('EmitWebpackPlugin:', option)
    })
  }
}

module.exports = EmitWebpackPlugin