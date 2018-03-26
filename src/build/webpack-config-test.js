const config = require('./config.js')

module.exports = {
  mode: 'development',
  entry: config.FOLDERS.SRC + '/build/index.js',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve:{
    extensions: ['.ts']
  }
}
