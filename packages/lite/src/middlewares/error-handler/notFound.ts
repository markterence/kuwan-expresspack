import type { RequestHandler } from "express";

export function notFoundErrorHandler(): RequestHandler {
    return (req, res, next) => {
        res.status(404).json({ error: 'Not Found' });
    };
}
