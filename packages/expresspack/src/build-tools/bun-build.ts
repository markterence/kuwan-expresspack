import Bun, { type BuildConfig } from 'bun';
import { join } from 'node:path';

const DEFAULT_BUILD_OPTIONS: BuildConfig = {
    minify: process.env.NODE_ENV === 'production',
    entrypoints: ['./src/app.ts'],
    outdir: './dist',
    format: "esm",
    target: "node",
    splitting: true,
    naming: {
      entry: '[dir]/[name].[ext]',
      chunk: 'chunks/[name]-[hash].[ext]',
      asset: 'assets/[name]-[hash].[ext]',
    },
}

export async function bunBuild(options?: BuildConfig) {
    const buildOptions: BuildConfig = {
        ...DEFAULT_BUILD_OPTIONS,
        ...options,
    };

    // Uses fixed value for now to set `type` to "module" just to run it through Node runtime using ESM
    const packageJson = {
        name: "server-prod",
        version: "0.0.0",
        type: "module",
        private: true,
        dependencies: {}
    };

    const outDir = buildOptions.outdir;
    if (!outDir) {
        throw new Error("`outdir` must be specified in the build options.");
    }
    
    try { 
        const result = await Bun.build(buildOptions);
        await Bun.write(
            join(outDir, 'package.json'), 
            JSON.stringify(packageJson, null, 2)
        ); 
        return Promise.resolve(result);
    } catch (e) {
        // TypeScript does not allow annotations on the catch clause
        const error = e as AggregateError;
        return Promise.reject(error);
        // console.error("Build Failed");
        // console.error(error);
        // console.error(JSON.stringify(error, null, 2));
    }
}