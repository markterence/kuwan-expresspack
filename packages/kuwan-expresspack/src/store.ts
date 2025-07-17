import type { RequestHandler } from "express";

type RouteDefinition = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};

export const routeRegistry: RouteDefinition[] = [];
