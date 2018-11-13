const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js'
  },
  // loaders查找路径
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'src', 'loaders')]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src', 'loaders')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'log-loader',
          options: {
            op: 1
          }
        }
      },
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
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    })
  ]
}