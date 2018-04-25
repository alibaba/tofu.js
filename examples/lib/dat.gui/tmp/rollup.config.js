import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'es6.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'myApp'
  },
  plugins: [
    resolve({module: true}),
  ]
};
