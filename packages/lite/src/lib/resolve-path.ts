import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'

export function resolveAppPaths(root: string) {
    const rc = join(root, 'expresspack.config');
    const app = join(root, 'app')

    const config = join(root, 'config') 
    const appConfigFile = join(config, 'app');
    const bodyParserConfig = join(config, 'body-parser');

    // Subdirectories of `app` directory
    const controllers = join(app, 'controllers')
    const services = join(app, 'services')
    const errors = join(app, 'errors')

    // Main application directory 
    const middlewareFilePath = join(app, 'middlewares')
    const routesFilePath = join(app, 'routes')

    return {
        rc,
        root,
        app,
        middlewareFilePath,
        routesFilePath,

        config: {
            base: config,
            bodyParserFile: bodyParserConfig,
            appConfigFile,
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
    // Priority order: .ts -> .mts -> .js -> .mjs -> .cjs -> .cts
    const extensions = ['ts', 'mts', 'js', 'mjs', 'cjs', 'cts']
    
    for (const ext of extensions) {
        const file = `${filePath}.${ext}`;
        if (existsSync(file)) {
            return file
        }
    }
    
    return null
}

export const checkDir = (filePath: string) => { 
    if (existsSync(filePath)) {
        return filePath
    } 
    return null
}

export const getRelativeFilePath = (filePath: string, root: string) => {
    if (!filePath.startsWith(root)) {
        throw new Error(`File path ${filePath} does not start with root ${root}`);
    }
    // Do not strip the file extension if its a file.
    
    return relative(root, filePath);
}