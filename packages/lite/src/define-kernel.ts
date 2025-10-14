import type { Express } from 'express';

export type AppContext = {
    app: Express
};

export type KernelExports = ((context: AppContext) => void) |  Promise<void>;

/**
 * This is mostly a plain Express middleware definition.
 * 
 * We just called it "**kernel**" to avoid mixing routers 
 * and main app middlewares.
 */
export function defineKernel(def: KernelExports) {
  return def;
}