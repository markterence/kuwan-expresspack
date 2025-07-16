// kuwan-expresspack/src/server/middlewareLoader.ts

import { existsSync } from 'node:fs'
import { resolveAppPaths } from './resolveAppPaths.js'
import consola from 'consola'

export async function middlewareLoader(app: any, router: any, root: string) {
  const { middlewareFilePath } = resolveAppPaths(root)
  consola.debug(`Loading middleware from: ${middlewareFilePath}`);

  const candidates = [`${middlewareFilePath}.ts`, `${middlewareFilePath}.js`, `${middlewareFilePath}.mjs`]
  const file = candidates.find((p) => existsSync(p))
  if (!file) {
    consola.warn(`No middleware file found at: ${middlewareFilePath}`);
    return
  }

  const setup = (await import(file)).default
  if (typeof setup === 'function') {
    consola.debug('Executing middleware setup function');
    await setup({ app, router })
    return
  }

  if (setup?.app) {
    consola.debug('App Middleware is object');
    for (const mw of setup.app) {
      app.use(mw)
    }
  }

  if (setup?.router) {
        consola.debug('Router middleware is object');
    for (const mw of setup.router) {
      if (Array.isArray(mw)) {
        router.use(mw[0], mw[1])
      } else {
        router.use(mw)
      }
    }
  }
}
