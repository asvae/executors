const config = require('./config.js')

module.exports = {
  entry: config.FOLDERS.SRC + '/build/index.js',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/,
      // },
    ],
  },
  resolve:{
    extensions: ['.ts']
  }
}
