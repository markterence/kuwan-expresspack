import { createRouter } from './router-factory';
import { Router, type RouterOptions, type Express } from 'express';

export interface DefineRouteMiddlewareContext {
    // Making it optional for now, so it wont break
    // existing uses of `defineRouterMiddleware`.
    app?: Express,
    router: Router
}

export interface DefineRouterMiddlewareReturn {
    (app?: Express): Router
}

/**
 * Utility to define a router middleware using a callback.
 * @param fn Callback to register routes on the router
 * @returns Express Router instance
 * 
 * @example 
 * 
 * ```ts
 * const routerMiddleware =  defineRouterMiddleware(({ router, app }) => {
 *  router.get('/hello', (req, res) => {
 *    res.send('Hello from router middleware!');
 *  });
 *  
 *  app.use(controller);
 * });
 * 
 * // In your main app file
 * const app = express();
 * app.use(middlewares);
 * routerMiddleware(app);
 */
export function defineRouterMiddleware(
    fn: (context: DefineRouteMiddlewareContext) => void, 
    options?: RouterOptions
): DefineRouterMiddlewareReturn {
    // const r = createRouter(options);
    // fn(r);
    // return r;
    return (app?: Express) =>{
        const r = createRouter(options);
        fn({ app, router: r });
        return r;
    };
}
