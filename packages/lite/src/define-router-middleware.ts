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

export interface DefineRouterMiddlewareOptions extends RouterOptions {
    /**
     * When `true`, the internal router will be mounted on the app so it  
     * can be used directly in the callback.
     */
    mountInternalRouter?: boolean;
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
    options?: DefineRouterMiddlewareOptions
): DefineRouterMiddlewareReturn {
    // const r = createRouter(options);
    // fn(r);
    // return r;

    const defaultOptions: DefineRouterMiddlewareOptions = {
        mountInternalRouter: false
    };

    const isExpressInstance = (app: any): app is Express => {
        return app && typeof app.use === 'function' && typeof app.get === 'function';
    }

    // extract original Express RouterOptions
    const { mountInternalRouter, ...routerOptions } = { ...defaultOptions, ...options };

    return (app?: Express) =>{
        const r = createRouter(routerOptions);
        fn({ app, router: r });
        
        if (mountInternalRouter) {
            // check if app is Express instance and if so, we 
            // need to register the router with the app. 
            // Usage is `routerMiddleware(app)`, but since 
            // `router` is passed to the callback, when user uses the router callback
            // like `router.get()`, it will not be registered with the app, so we need to do it here
            if (isExpressInstance(app)) {
                app.use(r);
            }
        }

        return r;
    };
}
