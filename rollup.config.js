
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  sourcemap: true,
  output: [
    {
      format: 'umd',
      name: 'Tofu',
      file: 'build/tofu.js',
    },
    {
      format: 'es',
      file: 'esm/index.js',
    },
  ],
  plugins: [
    resolve(),
    babel({
      // exclude: 'node_modules/**', // direct dependencies three.interaction source code
    }),
  ],
  extend: true,
  external: [ 'three' ],
  globals: {
    three: 'THREE',
  },
  watch: {
    exclude: [ 'node_modules/**' ],
  },
};
