const config = require('./config.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = function () {
  return {
    mode: 'development',
    entry: {
      app: config.FOLDERS.SRC + '/build/index.js',
    },
    stats: {
      colors: true,
      modules: true,
      reasons: true,
      errorDetails: true,
    },
    resolve: {
      extensions: ['.ts'],
    },
    performance: {
      hints: false,
    },
    output: {
      path: config.FOLDERS.BUILD,
      filename: 'index.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['build'], { root: config.FOLDERS.ROOT }),
    ],
  }
}
