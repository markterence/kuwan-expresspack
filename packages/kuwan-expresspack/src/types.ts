import type { NextFunction, Express, Request, Router, Response, RequestHandler } from 'express'

export type NextHandleFunction = (req: Request, res: Response, next: NextFunction) => any
export type RoutePattern = `${string} /${string}`;

export type RouteDefinition = {
  method: string;
  path: string;
  routerName?: string;
  handlers: RequestHandler[];
};

export type CreateRouterReturn = {
    router: Router;
    defineRoute: (path: RoutePattern, ...handlers: RequestHandler[]) => void;
    // registerCollectedRoutes: () => void;
}

export type ConfigValue = any
export type ConfigMap = Map<string, ConfigValue>

/**
 * Intended use is for internal use only, not for public API.
 */
export interface CreateAppContext {
    app: Express;
    router: Router;
    defineRoute: (path: RoutePattern, ...handlers: RequestHandler[]) => void;
    rootRouter: CreateRouterReturn
    root: string;
}

export type AppContext = Omit<CreateAppContext, 'rootRouter'>;

export interface AppHooks {
  onRouteLoaded?: (route: RouteDefinition) => void;
  onServerReady?: () => void;
  onAllRoutesRegistered?: (
    data: {
      totalRoutes: number;
      registeredRoutes: number;
      routerCount: number;
    }
  ) => void;
}

export type RouteContext = Pick<CreateAppContext, 
  'defineRoute' |
  'app' |
  'router'
>;

export type MiddlewareExports =
  ((ctx: CreateAppContext) => void | Promise<void>);

export type RouteExports = ((ctx: RouteContext) => void | Promise<void>);