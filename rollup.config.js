import typescriptPlugin from 'rollup-plugin-typescript'
import typescript from 'typescript'

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/src/index.esm.js',
    format: 'esm',
  },
  plugins: [
    typescriptPlugin({typescript}),
  ],
  external: ['tslib'],
}
