class CompileWebpackPlugin {
  apply (compiler) {
    compiler.hooks.compile.tap('CompileWebpackPlugin', (option) => {
      console.log('CompileWebpackPlugin:', option)
    })
  }
}

module.exports = CompileWebpackPlugin