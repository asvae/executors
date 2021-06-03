const config = require('./config.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = function () {
  return {
    mode: 'production',
    devtool: 'source-map',
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
      globalObject: 'Function("return this")()', // allows it to work in different environments.
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
      new CleanWebpackPlugin(),
    ],
  }
}
