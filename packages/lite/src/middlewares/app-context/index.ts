import type { Request, Response, NextFunction } from 'express';
import { asyncLocalStorage, type InternalContext } from '../../context/context-store/context-store-internal';
import { useAppContext } from '../../context/simple-context';

/**
 * Configuration options for context middleware
 */
export interface ContextStoreConfig {
    /**
     * Whether to enable the context middleware
     * @default true
     */
    enabled?: boolean;
}

/**
 * Express middleware that initializes async context for each request
 * This middleware must be registered before any code that uses getAppContext()
 * 
 * @example
 * ```typescript
 * import express from 'express';
 * import { contextStoreMiddleware } from 'expresspack';
 * 
 * const app = express();
 * 
 * // Register as early as possible
 * app.use(contextStoreMiddleware());
 * ```
 */
export function contextStoreMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        const internal: InternalContext = {
            data: new Map(),
        };

        asyncLocalStorage.run(internal, () => {
            next();
        });
    };
}

/**
 * For types you need to augment the Request type to include appContext 
 * and also include the type for appContext.
 * 
 * @example
 * ```ts
 * declare global {
 *  namespace Express {
 *   interface Request {
 *      appContext: {
 *          user: User;
 *          session: Session;
 *      };
 *   }
 * }
 * ```
 */
export function simpleContextMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
        const appContext = useAppContext(req);
        (req as any).appContext = appContext;
        next();
    }
}