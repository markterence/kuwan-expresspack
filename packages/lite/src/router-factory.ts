
import { Router, type RouterOptions } from "express";

export function createRouter(options?: RouterOptions): Router {
    const router: Router = Router(options);

    return router;
}