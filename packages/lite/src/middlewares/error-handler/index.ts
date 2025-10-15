import { CustomError } from "../../error";
import type { ErrorRequestHandler } from 'express';

export { notFoundErrorHandler } from "./notFound";

export function errorHandler(): ErrorRequestHandler {
    return (err, req, res, next) => {
        if(CustomError.isCustomError(err)) {
            return res
                .status(err.statusCode)
                .json(err.toJSON());
        } 
        
        if (err instanceof Error) {
            const statusCode = (err as any).statusCode || 500;
            return res
                .status(statusCode)
                .json({ error: 'Internal Server Error' });
        }
        
        next(err);
    }
}
