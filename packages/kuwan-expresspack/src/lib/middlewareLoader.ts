import { clearRouteCollections, registerCollectedRoutes } from '../store.js';
import { getFileCandidate, resolveAppPaths } from './resolveAppPaths.js'
import consola from 'consola'

export async function middlewareLoader(app: any, router: any, root: string) {
  const { middlewareFilePath } = resolveAppPaths(root)
  consola.debug(`Loading middleware from: ${middlewareFilePath}`);
 
  const file = getFileCandidate(middlewareFilePath)
  if (!file) {
    consola.warn(`No middleware file found at: ${middlewareFilePath}`);
    return
  }

  const setup = (await import(file)).default
  if (typeof setup === 'function') {
    consola.debug('Executing middleware setup function');
    await setup({ app, router })

    registerCollectedRoutes();
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
