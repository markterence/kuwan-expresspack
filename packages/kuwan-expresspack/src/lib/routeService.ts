import consola from "consola";
import type { RequestHandler, Router } from "express";
import { colorizeHTTPMethod, HTTP_METHODS } from "./utils";
import {
    routeCollections,
    registeredRoutes,
    DEFAULT_ROUTER_NAME,
    appHooks,
 } from '../store';

const methodSet = new Set(HTTP_METHODS);

/**
 * Parses `METHOD /path` naming and returns an object with `method` and `path`.
*/
export function parseRoutePattern(routePattern: string): { method: string; path: string } | null {
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
 * Adds a route to the collection including it's handler to register it 
 * with `registerCollectedRoutes()`.
 */
export function addRouteToCollection(router: Router, routerId: string | undefined, method: string, path: string, handlers: RequestHandler[]) {
    if (!routeCollections.has(router)) {
        // maybe we count inject __routerId on the router here.
        // (router as any).__routerId = routerId;
        routeCollections.set(router, []);
    }

    routerId = routerId || 'default';
    const routes = routeCollections.get(router)!;
    routes.push({ method, path, handlers, routerName: routerId });
}

/**
 * Adds a route to another collection without the handlers to be used for introspection.
 */
export function registerRouteInfo(router: Router, method: string, path: string, routerName?: string) {
    if (!registeredRoutes.has(router)) {
        registeredRoutes.set(router, []);
    }

    const routes = registeredRoutes.get(router)!;
    routes.push({ method, path, routerName });
}

export function getRouteCollection(router: Router) {
    return routeCollections.get(router) || [];
}

export function getAllRouteCollections() {
    return routeCollections;
}

export function getRegisteredRoutes(router?: Router) {
    if (router) {
        return registeredRoutes.get(router) || [];
    }
    return registeredRoutes;
}

/**
 * Clears only the collections with the handlers and not the other collection
 * with only method and path information.
 */
export function clearRouteCollections() {
    consola.debug(`Clearing route collections for ${routeCollections.size} routers`);
    routeCollections.clear();
}

function countRoutes() {
    let totalRoutes = 0;
    for (const [_unused_router, routes] of routeCollections) {
        totalRoutes += routes.length;
    }
    return totalRoutes;
}

/**
 * Registers all collected routes from the `routeCollections` to the Express app
 * and clears the handler collections after registration.
 */
export async function registerCollectedRoutes() {
    consola.debug(`Registering routes for ${routeCollections.size} routers from \`createRoute()\``);
    let totalRoutes = countRoutes();
    let registeredRoutes = 0;

    for (const [router, routes] of routeCollections) {
        // const routerId = (router as any).__routerId || DEFAULT_ROUTER_NAME;
        // consola.debug(`Registering ${routes.length} routes for router (${routerId})`);
        
        // get routerId, its no longer set on the router but now passed as part of the route definition
        const routerId = routes[0]?.routerName || DEFAULT_ROUTER_NAME;
        consola.debug(`Registering ${routes.length} routes for router (${routerId})`);

        for (const route of routes) {
            const method = route.method.toLowerCase();
            const routePath = route.path;
            const handlers = route.handlers;

            const routeFn = (router as any)[method] as ((path: string, ...handlers: RequestHandler[]) => void) | undefined;

            if (routeFn === undefined) {
                consola.error(`Route function for method \`${method} ${routePath}\` is undefined`);
            } else {
                const routerName = route.routerName || DEFAULT_ROUTER_NAME;
                consola.debug(`Registering route: (${routerName}) ${colorizeHTTPMethod(method)} ${routePath}`);
               
                routeFn.call(router, routePath, ...handlers);
                registerRouteInfo(router, method.toUpperCase(), routePath, route.routerName);
                registeredRoutes++;

                if (appHooks.onRouteLoaded) {
                    await Promise.resolve(appHooks.onRouteLoaded([{ method, path: routePath, handlers }]));
                }
            }
        }
    }

    const stats = {
        totalRoutes,
        registeredRoutes,
        routerCount: routeCollections.size
    };

    if (appHooks.onAllRoutesRegistered) {
        await Promise.resolve(appHooks.onAllRoutesRegistered(stats));
    }

    // Clear the collections after registration. This only clears the collections with handlers.
    // The other registered routes info is kept for later use such as introspection.
    clearRouteCollections();
}