const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FileListPlugin = require('./src/plugins/FileListPlugin.js')
const MyPlugin = require('./src/plugins/MyPlugin.js')
const HtmlWebpackInlineSourcePlugin = require('./src/plugins/HtmlWebpackInlineSourcePlugin.js')
const CompileWebpackPlugin = require('./src/plugins/CompileWebpackPlugin.js')
const AfterCompileWebpackPlugin = require('./src/plugins/AfterCompileWebpackPlugin.js')
const EmitWebpackPlugin = require('./src/plugins/EmitWebpackPlugin.js')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  // loaders查找路径
  resolveLoader: {
    modules: [path.resolve(__dirname, 'src', 'loaders'), 'node_modules']
  },
  // resolve: {
  //   modules: [path.resolve(__dirname, 'src', 'loaders'), 'node_modules']
  // },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.jpg$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CompileWebpackPlugin(),
    new AfterCompileWebpackPlugin(),
    new EmitWebpackPlugin()

    // new MyPlugin(),
    // new FileListPlugin(),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   filename: 'index.html'
    // }),
    // new HtmlWebpackInlineSourcePlugin({
    //   inlineSource: /\.(js|css)$/
    // })
  ]
}