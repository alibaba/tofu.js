import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      extend: true,
      globals: {
        three: 'THREE',
      },
      format: 'umd',
      name: 'JC',
      file: 'build/boids.js',
      sourcemap: true,
    },
    {
      extend: true,
      globals: {
        three: 'THREE',
      },
      format: 'es',
      file: 'build/boids.module.js',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [ 'three' ],
  watch: {
    exclude: [ 'node_modules/**' ],
  },
};
