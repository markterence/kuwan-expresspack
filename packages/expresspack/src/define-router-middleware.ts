import { createRouter } from './router-factory';
import type { Router } from 'express';

/**
 * Utility to define a router middleware using a callback.
 * @param fn Callback to register routes on the router
 * @returns Express Router instance
 */
export function defineRouterMiddleware(fn: (router: Router) => void): Router {
    const router = createRouter();
    fn(router);
    return router;
}