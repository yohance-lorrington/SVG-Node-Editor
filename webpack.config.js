const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.min.js',
    publicPath: '/'
  },
  devServer: {
    port: 80,
    contentBase: './dist',
    disableHostCheck: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.(png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: {
            name: 'assets/[name].[ext]',
        }
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}