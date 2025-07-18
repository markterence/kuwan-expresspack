import type { RequestHandler } from 'express';
import { HTTP_METHODS } from './lib/utils'; 
import { routeRegistry } from './store';
import type { RoutePattern } from './types';

const methodSet = new Set(HTTP_METHODS);

export const defineRoute = (path: RoutePattern, ...handlers: RequestHandler[]) => {
    const [method, ...rest] = path.split(' ');
    const routePath = rest.join(' ');

    if (!routePath.startsWith('/')) {
        throw new Error(`Route path must start with a slash: ${routePath}`);
    }
    
    if (!method) {
        throw new Error('HTTP method is required');
    }
    
    if (!methodSet.has(method)) {
        throw new Error(`Invalid HTTP method: ${method}`);
    }

    routeRegistry.push({ method: method.toLowerCase(), path: routePath, handlers });
}

