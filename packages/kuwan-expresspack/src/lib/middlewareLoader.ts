import { clearRouteCollections, registerCollectedRoutes } from '../store.js';
import type { CreateAppContext, MiddlewareExports } from '../types.js';
import { getFileCandidate, getRelativeFilePath, resolveAppPaths } from './resolveAppPaths.js'
import consola from 'consola'

export async function middlewareLoader(c: CreateAppContext): Promise<void> {
  const { middlewareFilePath } = resolveAppPaths(c.root);
  const file = getFileCandidate(middlewareFilePath)

  if (!file) {
    consola.warn(`No middleware file found at: ${middlewareFilePath}`);
    return
  }

  const relativeMiddlewaresFilePath = getRelativeFilePath(file, c.root);
  consola.debug(`Loading middleware from: ${relativeMiddlewaresFilePath}`);
  
  const setup: MiddlewareExports = (await import(file)).default
  if (typeof setup === 'function') {
    consola.debug('Executing middleware setup function');
    await setup(c);
  }
  
  // Object-based middleware setup is here but not tested.
  // Just kept here for reference.
  // if (setup?.app) {
  //   consola.debug('App Middleware is object');
  //   for (const mw of setup.app) {
  //     app.use(mw)
  //   }
  // }

  // if (setup?.router) {
  //   consola.debug('Router middleware is object');
  //   for (const mw of setup.router) {
  //     if (Array.isArray(mw)) {
  //       router.use(mw[0], mw[1])
  //     } else {
  //       router.use(mw)
  //     }
  //   }
  // }
}
