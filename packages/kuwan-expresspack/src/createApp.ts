
import express from 'express'
import consola from 'consola'
import { middlewareLoader } from './lib/middlewareLoader';
consola.level = 4; // Set to debug level
export async function createApp(): Promise<express.Express> {
    const root = process.cwd()

    const app = express()
    const router = express.Router()

    const port = 3000;
    
    // asyncLoader(middlewareLoader(app, router, root))
    await middlewareLoader(app, router, root)

    // Register router middleware
    app.use(router)
    
    app.listen(port, () => {
        consola.box({
            message: `Server is running at http://localhost:${port}`,
            style: { borderColor: 'cyan' }
        })
    })

    return app;
}
