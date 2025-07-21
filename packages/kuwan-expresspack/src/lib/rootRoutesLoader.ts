/**
 * Copyright (c) 2023-present, Mark Terence Tiglao (markterencetiglao@gmail.com)
 * 
 */
import { getFileCandidate, getRelativeFilePath, resolveAppPaths } from './resolveAppPaths.js'
import consola from 'consola' 
import type { Express, RequestHandler, Router } from 'express'; 
import type { CreateAppContext } from '../types.js';

/**
 * Loads the `app/routes.ts` file from the application directory and registers the routes
 * with the provided Express app and router.
 */
export async function rootRoutesLoader(c: CreateAppContext) {
  
  const { routesFilePath } = resolveAppPaths(c.root);
  const file = getFileCandidate(routesFilePath)

  if (!file) {
    consola.warn(`No root route file found at: ${routesFilePath}`);
    return
  }

  const relativeRoutesFilePath = getRelativeFilePath(file, c.root);

  consola.debug(`Loading routes from: ${relativeRoutesFilePath}`);
 
  try {
   const routeModule = await import(file);
   const defineRoutes = routeModule?.default || routeModule;

      if (typeof defineRoutes === 'function') {
            consola.debug('Executing root routes definition function');
            await defineRoutes({ 
                defineRoute: c.defineRoute,
                router: c.router,
                app: c.app
            });
        } else {
            consola.error(`"${relativeRoutesFilePath}" must export a default function`);
        }

  } catch (error) {
    consola.error(`Failed to load routes from ${file}:`, error);
    return;
  }
}
