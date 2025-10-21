import process from 'node:process';
import { defineConfig } from 'tsup';

export default defineConfig([
 
  {
    ignoreWatch: ['**/*.test.ts', '**/__tests__/**', '**/dist/**', '**/{.git,node_modules}/**' ],
    clean: false,
    treeshake: true,
    entry: [
      'src/index.ts',
      'src/error.ts',
      'src/config.ts',
      'src/env.ts',
      'src/build-tools/index.ts', 
      'src/eslint-config/index.ts',
      'src/middlewares/*/index.ts', 
      'src/services/*/index.ts',
      'src/utils/*.ts',
      'src/third-party/*.ts',
    ], 
    outExtension({ format }) {
      return {
          js: format === "esm" ? ".mjs" : ".js",
      }
    },
    external: ['bun', 'eslint'],
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
  {
      ignoreWatch: ['**/*.test.ts', '**/__tests__/**', '**/dist/**', '**/{.git,node_modules}/**' ],
    clean: false,
    treeshake: true,
    entry: [
      'src/bin/expresspack-api.ts',
    ],
    outDir: 'dist/bin',
    outExtension({ format }) {
      return {
          js: format === "esm" ? ".mjs" : ".js",
      }
    },
    external: ['bun', 'eslint'],
    platform: 'node',
    dts: false,
    format: ['esm'],
    shims: true,
    target: 'esnext',
    sourcemap: false,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
]);