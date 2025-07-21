import type { Router } from "express";
import type { RouteDefinition, ConfigMap } from "./types";

export const DEFAULT_ROUTER_NAME = "no-name";

export const routeRegistry: RouteDefinition[] = [];

export let globalConfigMap: ConfigMap = new Map()

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
