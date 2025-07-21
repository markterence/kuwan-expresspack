import express, { Router, type RequestHandler } from 'express';
import type { CreateRouterReturn, RoutePattern } from './types';
import { HTTP_METHODS } from './lib/utils';
import consola from 'consola';
import { addRouteToCollection, getRouteCollection, registerRouteInfo } from './store';


const methodSet = new Set(HTTP_METHODS);

export function createRouter(routerId?: string): CreateRouterReturn {
    const router = express.Router();

    /**
     * Parses `METHOD /path` naming and returns an object with `method` and `path`.
     */
    function parseRoutePattern(routePattern: string): { method: string; path: string } | null {
        const [method, ...rest] = routePattern.split(' ');
        const routePath = rest.join(' ');

        if (!routePath.startsWith('/')) {
            throw new Error(`Route path must start with a slash: ${routePath}`);
        }

        if (!method) {
            throw new Error('HTTP method is required');
        }

        if (!methodSet.has(method)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        return { method, path: routePath };
    }

    /**
     * Calls the `route.get()`, etc. methods of the Express Router.
     */
    function registerRoute(method: string, path: string, handlers: RequestHandler[]) {
        const lowerCaseMethod = method.toLowerCase();
        const routeFn = (router as any)[lowerCaseMethod] as ((path: string, ...handlers: RequestHandler[]) => void) | undefined;

        if (routeFn === undefined) {
            consola.error(`Route function for method \`${method} ${path}\` is undefined`);
        } else {
            consola.debug(`Registering route: ${method.toUpperCase()} ${path}`);
            routeFn.call(router, path, ...handlers);

            registerRouteInfo(router, method, path, routerId)
        }
    }

    function defineRoute(path: RoutePattern, ...handlers: RequestHandler[]) {
        const parsed = parseRoutePattern(path);
        if (!parsed) {
            consola.error(`Invalid route pattern: ${path}`);
            return;
        }

        const { method, path: routePath } = parsed;

        addRouteToCollection(router, routerId, method, routePath, handlers);
        // No longer need to be called immediately
        // Since we register it later-on
        // registerRoute(method, routePath, handlers);

        // TODO: collect the routes.
        // routeRegistry.push({ method: method.toLowerCase(), path: routePath, handlers });
    }

    // function registerCollectedRoutes() {
    //     const routes = getRouteCollection(router);
    //     for (const route of routes) {
    //         registerRoute(route.method, route.path, route.handlers);
    //     }
    // }



    //> Experimental: Attach `defineRoute` directly to the router.
    //> However, this may cause type issues with TypeScript, saying
    //> that "`defineRoute` does not exist on type `Router`".
    // (router as any).defineRoute = defineRoute;
    // (router as any).registerCollectedRoutes = registerCollectedRoutes;

    return { router, defineRoute };
}