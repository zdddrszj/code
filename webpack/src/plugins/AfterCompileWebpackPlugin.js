class AfterCompileWebpackPlugin {
  apply (compiler) {
    compiler.hooks.compile.tap('AfterCompileWebpackPlugin', (option) => {
      console.log('AfterCompileWebpackPlugin:', option)
    })
  }
}

module.exports = AfterCompileWebpackPlugin