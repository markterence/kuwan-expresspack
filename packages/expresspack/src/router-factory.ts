
import { Router } from "express";

export function createRouter(routerId?: string): Router {
    const router: Router = Router();

    return router;
}