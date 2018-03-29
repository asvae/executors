const config = require('./config.js')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
}
