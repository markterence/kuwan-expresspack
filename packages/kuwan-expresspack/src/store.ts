import type { RequestHandler } from "express";
import type { RouteDefinition } from "./types";


export const routeRegistry: RouteDefinition[] = [];
export const appHooks: {
    onRouteLoaded?: (routes: RouteDefinition[]) => void;
    onServerReady?: () => void;
} = {};
