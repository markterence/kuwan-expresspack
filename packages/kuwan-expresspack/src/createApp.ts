
import express, { Router } from 'express'
import consola from 'consola'
 
import { middlewareLoader } from './lib/middlewareLoader';
import { rootRoutesLoader } from './lib/rootRoutesLoader.js';
import { registerCollectedRoutes, routeRegistry } from './store.js';
import { createRouter } from './router.js';

consola.level = 4; // Set to debug level
export async function createApp(): Promise<express.Express> {
    const root = process.cwd()

    const app = express()
    const rootRouter = createRouter();
    
    // const router: Router = express.Router();
    // const { router, defineRoute } = rootRouter;

    const port = 3000;

    const context = {
        app,
        router: rootRouter.router,
        defineRoute: rootRouter.defineRoute,
        rootRouter,
        root
    }
    
    // asyncLoader(middlewareLoader(app, router, root))
    await middlewareLoader(context)
    await rootRoutesLoader(context);

    await registerCollectedRoutes();

    // Register router middleware
    // await routesLoader(app, router, {routeRegistry}, root)
    // Load the routes defined in `middleware.ts` last? 
    app.use(rootRouter.router);

    app.listen(port, () => {
        consola.box({
            message: `Server is running at http://localhost:${port}`,
            style: { borderColor: 'cyan' }
        })
    })

    return app;
}
