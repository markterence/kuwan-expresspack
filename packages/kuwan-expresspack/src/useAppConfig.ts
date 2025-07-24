import { globalConfigMap } from "./store";
import type { ConfigMap } from "./types";

export function useAppConfig<T = unknown>(): ConfigMap;
export function useAppConfig<T = unknown>(name: string): T | undefined;
export function useAppConfig<T = unknown>(name?: string): T | ConfigMap | undefined {
    if (!name) {
        return globalConfigMap;
    } 
    const v = globalConfigMap.get(name);
    return v as typeof v;
    
};