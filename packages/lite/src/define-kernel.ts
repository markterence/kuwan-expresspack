import type { Express } from 'express';

export type AppContext = {
    app: Express
};

export type KernelExports = ((context: AppContext) => void) |  Promise<void> | void;

/**
 * This is mostly a plain Express middleware definition.
 * 
 * We just called it "**kernel**" to avoid mixing routers 
 * and main app middlewares.
 * @deprecated 
 * This will be removed in future versions.
 * Use `defineMiddlewareKernel` instead.
 */
export function defineKernel(def: KernelExports) {
  return def;
}

 
/**
 * Defines a middleware kernel for the framework.
 * Accepts a setup function that receives the app context.
 * Use for registering global middleware (e.g., app.use).
 */
export function defineMiddlewareKernel(
    setup: (context: { app: Express }) => void | Promise<void>
) {
    return setup;
}