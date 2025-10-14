import { CustomError } from "../../error";
import type { ErrorRequestHandler } from 'express';

export function errorHandler(): ErrorRequestHandler {
    return (err, req, res, next) => {
        if(CustomError.isCustomError(err)) {
            return res
                .status(err.statusCode)
                .json(err.toJSON());
        }
    }
}