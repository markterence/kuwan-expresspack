import express, { Router, type RequestHandler } from 'express';
import type { CreateRouterReturn, RoutePattern } from './types';
import { HTTP_METHODS } from './lib/utils';
import consola from 'consola';
import { addRouteToCollection, parseRoutePattern } from './lib/routeService';



export function createRouter(routerId?: string): CreateRouterReturn {
    const router = express.Router();

    function defineRoute(path: RoutePattern, ...handlers: RequestHandler[]) {
        const parsed = parseRoutePattern(path);
        if (!parsed) {
            consola.error(`Invalid route pattern: ${path}`);
            return;
        }

        const { method, path: routePath } = parsed;

        addRouteToCollection(router, routerId, method, routePath, handlers);
    }

    //> Experimental: Attach `defineRoute` directly to the router.
    //> However, this may cause type issues with TypeScript, saying
    //> that "`defineRoute` does not exist on type `Router`".
    // (router as any).defineRoute = defineRoute;
    // (router as any).registerCollectedRoutes = registerCollectedRoutes;

    return { router, defineRoute };
}