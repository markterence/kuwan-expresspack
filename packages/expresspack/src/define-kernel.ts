import type { Express } from 'express';

export type AppContext = {
    app: Express
};

export type KernelExports = ((context: AppContext) => void) |  Promise<void>;

export function defineKernel(def: KernelExports) {
  return def;
}