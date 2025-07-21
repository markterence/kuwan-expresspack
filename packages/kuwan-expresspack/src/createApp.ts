
import express, { Router } from 'express'
import consola from 'consola'
 
import { middlewareLoader } from './lib/middlewareLoader';
import { rootRoutesLoader } from './lib/rootRoutesLoader';
import { registerCollectedRoutes } from './lib/routeService';
import { createRouter } from './router.js';
import { loadAllConfigs } from './lib/configLoader.js';

consola.level = 4; // Set to debug level

export async function createApp(): Promise<express.Express> {
    consola.debug('Booting application...');

    const root = process.cwd()

    await loadAllConfigs(root)

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

    // Load the routes defined in `middleware.ts` last? 
    app.use(rootRouter.router);

    const server = app.listen(port, () => {
        consola.box({
            message: `Server is running at http://localhost:${port}`,
            style: { borderColor: 'cyan' }
        })
    });

    (app as any).down = () => {
        return new Promise<void>((resolve) => {
            server.close((err?: Error) => {
                if (err instanceof Error) {
                    consola.error('Error shutting down server:', err);
                    return resolve();
                }
                consola.info('Server has been shut down.');
                resolve();
            });
        })
    }

    return app;
}
