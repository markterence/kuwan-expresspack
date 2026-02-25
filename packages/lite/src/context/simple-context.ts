/**
 * Simple Context - Use when AsyncLocalStorage is not needed or not available.
 * 
 */

import type { Request } from 'express';

 
/**
 * Helper function to set/get values in Request.
 */
export function useAppContext<TData extends Record<never, never> = Record<never, never>> (req: Request) {
  const set = (key: string, value: any) => {
    if (!(req as any).appContext) {
      (req as any).appContext = {};
    }
    (req as any).appContext[key] = value;
  };

  function get<K extends keyof TData>(key: K): TData[K] | undefined {
    return (req as any).appContext?.[key];
  }

  return {
    set,
    get,
  };
}
