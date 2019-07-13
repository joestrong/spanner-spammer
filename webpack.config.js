const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }]
  }
};