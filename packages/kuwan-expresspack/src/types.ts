import type { NextFunction, Express, Request, Router, Response, RequestHandler } from 'express'

export type NextHandleFunction = (req: Request, res: Response, next: NextFunction) => any
export type RoutePattern = `${string} /${string}`;
export type MiddlewareExports =
  | ((ctx: { app: Express; router: Router }) => void | Promise<void>)
  | {
      app?: RequestHandler[]
      router?: [string, RequestHandler][] | RequestHandler[]
    }
 
export type RouteDefinition = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};


export type CreateRouterReturn = {
    router: Router;
    defineRoute: (path: RoutePattern, ...handlers: RequestHandler[]) => void;
    // registerCollectedRoutes: () => void;
}