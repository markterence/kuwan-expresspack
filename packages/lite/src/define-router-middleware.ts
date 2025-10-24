import { createRouter } from './router-factory';
import type { Router, RouterOptions } from 'express';

/**
 * Utility to define a router middleware using a callback.
 * @param fn Callback to register routes on the router
 * @returns Express Router instance
 */
export function defineRouterMiddleware(fn: (r: Router) => void, options?: RouterOptions): Router {
    const r = createRouter(options);
    fn(r);
    return r;
}