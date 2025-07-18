import type { RequestHandler, Router } from "express";
import type { RouteDefinition } from "./types";
import consola from "consola";


export const routeRegistry: RouteDefinition[] = [];

/**
 * Collects routes defined using `defineRoute`.
 */
export const routeCollections = new Map<Router, Array<RouteDefinition>>();

/**
 * Collection of registered routes that is
 * serializable (without handlers)
 */
export const registeredRoutes = new Map<Router, Array<{
    method: string;
    path: string;
    routerName?: string;
}>>();

export const appHooks: {
    onRouteLoaded?: (routes: RouteDefinition[]) => void;
    onServerReady?: () => void;
    onAllRoutesRegistered?: (data: any) => void;
} = {};

export function addRouteToCollection(router: Router, method: string, path: string, handlers: RequestHandler[]) {
    if (!routeCollections.has(router)) {
        routeCollections.set(router, []);
    }

    const routes = routeCollections.get(router)!;
    routes.push({ method, path, handlers });
}

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

// Clear only the collections with handlers, keep the registered routes info
export function clearRouteCollections() {
    routeCollections.clear();
}

export function registerCollectedRoutes() {
    consola.debug(`Registering routes for ${routeCollections.size} routers from \`createRoute()\``);
    let totalRoutes = 0;
    let registeredRoutes = 0;
    for (const [router, routes] of routeCollections) {
        totalRoutes += routes.length;
    }

    for (const [router, routes] of routeCollections) {
        consola.debug(`Registering ${routes.length} routes for router`);

        for (const route of routes) {

            const method = route.method.toLowerCase();
            const routePath = route.path;
            const handlers = route.handlers;

            const routeFn = (router as any)[method] as ((path: string, ...handlers: RequestHandler[]) => void) | undefined;

            if (routeFn === undefined) {
                consola.error(`Route function for method \`${method} ${routePath}\` is undefined`);
            } else {
                consola.debug(`Registering route: ${method.toUpperCase()} ${routePath}`);
                routeFn.call(router, routePath, ...handlers);
                registerRouteInfo(router, method.toUpperCase(), routePath);
                registeredRoutes++;

                if (appHooks.onRouteLoaded) {
                    appHooks.onRouteLoaded([{ method, path: routePath, handlers }]);
                }
            }
        }
    }
    if (appHooks.onAllRoutesRegistered) {
        appHooks.onAllRoutesRegistered({
            totalRoutes,
            registeredRoutes,
            routerCount: routeCollections.size
        });
    }
}