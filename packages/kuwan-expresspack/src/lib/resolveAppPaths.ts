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



    return {
        root,
        app,
        middlewareFilePath,

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
