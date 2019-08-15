import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    name: 'fetch-client',
    exports: 'named'
  },
  plugins: [
    ts({
      typescript,
      tsconfig: "tsconfig.build.json",
    }),
  ]
}
