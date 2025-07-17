
import { getFileCandidate, resolveAppPaths } from './resolveAppPaths.js'
import consola from 'consola' 
import type { Express, RequestHandler, Router } from 'express'; 

/**
 * Loads the `app/routes.ts` file from the application directory and registers the routes
 * with the provided Express app and router.
 */
export async function routesLoader(app: Express, router: Router, store: any, root: string) {
  
  const { routesFilePath } = resolveAppPaths(root)
  consola.debug(`Loading routes from: ${routesFilePath}`);
 
  const file = getFileCandidate(routesFilePath)
  if (!file) {
    consola.warn(`No middleware file found at: ${routesFilePath}`);
    return
  }

  try {
    await import(file);
  } catch (error) {
    consola.error(`Failed to load routes from ${file}:`, error);
    return;
  }

  for (const { method, path, handlers } of store.routeRegistry) {
    try{ 
      consola.debug(`Registering route: ${method.toUpperCase()} ${path}`);
      const lowerCaseMethod = method.toLowerCase();
      const routeFn = (router as any)[lowerCaseMethod] as ((path: string, ...handlers: RequestHandler[]) => void) | undefined;

      if (typeof routeFn !== 'function') {
        consola.error(`Router does not support method: ${method}`);
        continue;
      }
      if (routeFn === undefined) {
        consola.error(`Route function for method \`${method} ${path}\` is undefined`);
      }
      
      routeFn.call(router,path, ...handlers);

    } catch (error) {
      consola.error(`Failed to register route ${method.toUpperCase()} ${path}:`, error);
    }
  }
}
