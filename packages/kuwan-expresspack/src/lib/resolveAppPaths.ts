import { existsSync } from 'node:fs'
import { join } from 'node:path'

export function resolveAppPaths(root: string) {
    const app = join(root, 'app')
    // Subdirectories
    const config = join(app, 'config') 
    const bodyParserConfig = join(config, 'body-parser')

    const controllers = join(app, 'controllers')
    const services = join(app, 'services')
    const errors = join(app, 'errors')

    // Main application directory 
    const middlewareFilePath = join(app, 'middlewares')
    const routesFilePath = join(app, 'routes')



    return {
        root,
        app,
        middlewareFilePath,
        routesFilePath,

        config: {
            base: config,
            bodyParserFile: bodyParserConfig,
        },

        controllers: {
            base: controllers,
        },
        
        services: {
            base: services,
        },

        errors: {
            base: errors,
        }
    }
}

/**
 * `await import(file)` cant find the file without extension.
 * Also, when bundled, the file extension will become `.js` or `.mjs` and not `.ts`.
 */
export const getFileCandidate = (filePath: string) => {
    const candidates = [`${filePath}.ts`, `${filePath}.js`, `${filePath}.mjs`];
    const file = candidates.find((p) => existsSync(p));
    return file;
}