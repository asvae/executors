import typescriptPlugin from 'rollup-plugin-typescript'
import typescript from 'typescript'
import { uglify } from "rollup-plugin-uglify";

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/src/index.esm.js',
    format: 'esm',
  },
  plugins: [
    typescriptPlugin({typescript}),
    uglify()
  ],
  external: ['tslib'],
}
