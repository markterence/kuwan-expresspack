import { createRouter } from './router-factory';
import type { Router, RouterOptions } from 'express';

/**
 * Utility to define a router middleware using a callback.
 * @param fn Callback to register routes on the router
 * @returns Express Router instance
 */
export function defineRouterMiddleware(fn: (router: Router) => void, options?: RouterOptions): Router {
    const router = createRouter(options);
    fn(router);
    return router;
}