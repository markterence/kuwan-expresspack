import process from 'node:process';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    treeshake: true,
    entry: [
      'src/index.ts',
      'src/build-tools/index.ts',
      'src/config.ts',
      'src/middlewares/*/index.ts',
      'src/services/*/index.ts',
    ], 
    outExtension({ format }) {
      return {
          js: format === "esm" ? ".mjs" : ".js",
      }
    },
    external: ['bun'],
    platform: 'node',
    dts: true,
    format: ['esm'],
    shims: true,
    target: 'esnext',
    sourcemap: process.env.NODE_ENV !== 'production',
    minifyIdentifiers: process.env.NODE_ENV == 'production',
    minifySyntax: process.env.NODE_ENV == 'production',
    minifyWhitespace: process.env.NODE_ENV == 'production',
  },
]);