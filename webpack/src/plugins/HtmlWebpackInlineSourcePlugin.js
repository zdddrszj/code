class HtmlWebpackInlineSourcePlugin {
  constructor (options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('html-webpack-inline-source-plugin', (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('html-webpack-inline-source-plugin', (htmlPluginData, callback) => {
        if (!this.options.inlineSource) {
          return callback(null, htmlPluginData)
        }
        
        var result = this.processTags(compilation, htmlPluginData)
        callback(null, result)
      })
    })
  }
  processTags (compilation, htmlPluginData) {
    htmlPluginData.head = htmlPluginData.head.map(tag => this.processTag(compilation, tag))
    htmlPluginData.body = htmlPluginData.body.map(tag => this.processTag(compilation, tag))
    return htmlPluginData
  }
  processTag (compilation, tag) {
    var inlineSource = this.options.inlineSource
    var assertUrl = ''
    if (tag.tagName === 'script' && inlineSource.test(tag.attributes.src)) {
      assertUrl = tag.attributes.src
      tag.attributes = {type:'text/javascript'}
    }
    if (tag.tagName === 'link' && inlineSource.test(tag.attributes.href)) {
      assertUrl = tag.attributes.href
      tag.attributes = {type:'text/css'}
    }
    if (assertUrl) {
      tag.innerHTML = compilation.assets[assertUrl].source()
      delete compilation.assets[assertUrl]
    }
    return tag
  }
}
module.exports = HtmlWebpackInlineSourcePlugin;
