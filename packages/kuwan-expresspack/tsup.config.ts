import process from 'node:process';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    treeshake: true,
    entry: [
      'src/index.ts',
      'src/middlewares/*/index.ts',
      'src/utils.ts',
    ], 
    dts: true,
    format: ['esm'],
    shims: true,
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development',
    minifyIdentifiers: process.env.NODE_ENV === 'development',
    minifySyntax: process.env.NODE_ENV === 'development',
    minifyWhitespace: process.env.NODE_ENV === 'development',
  },
]);