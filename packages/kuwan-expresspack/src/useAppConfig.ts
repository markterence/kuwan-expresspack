import { globalConfigMap } from "./store";
import type { ConfigMap } from "./types";

export function useAppConfig<T = any>(): ConfigMap;
export function useAppConfig<T = any>(name: string): T | undefined;
export function useAppConfig<T = any>(name?: string): T | ConfigMap | undefined {
    if (!name) {
        return globalConfigMap;
    }

    return globalConfigMap.get(name) as T;
};