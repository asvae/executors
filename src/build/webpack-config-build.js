const config = require('./config.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')

module.exports = function () {
  return {
    mode: 'development',
    entry: {
      app: config.FOLDERS.SRC + '/index.ts',
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
      path: config.FOLDERS.DIST,
      filename: 'src/index.js',
      publicPath: '/',
      libraryTarget: 'umd',
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
      new CleanWebpackPlugin(['dist'], { root: config.FOLDERS.ROOT }),
      new TypedocWebpackPlugin({
        target: 'es2017',
      }),
    ],
  }
}
