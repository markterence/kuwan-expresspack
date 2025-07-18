
import express, { Router } from 'express'
import consola from 'consola'
 
import { middlewareLoader } from './lib/middlewareLoader';
import { routesLoader } from './lib/routesLoader';
import { routeRegistry } from './store.js';

consola.level = 4; // Set to debug level
export async function createApp(): Promise<express.Express> {
    const root = process.cwd()

    const app = express()
    const router: Router = express.Router();

    const port = 3000;

    // asyncLoader(middlewareLoader(app, router, root))
    await middlewareLoader(app, router, root)

    // Register router middleware
    await routesLoader(app, router, {routeRegistry}, root)
    // Load the routes defined in `middleware.ts` last? 
    app.use(router);
    app.listen(port, () => {
        consola.box({
            message: `Server is running at http://localhost:${port}`,
            style: { borderColor: 'cyan' }
        })
    })

    return app;
}
