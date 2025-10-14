const config: Record<string, unknown> = {};

export default config;

export function getAppConfig<K>(key: string): K;
export function getAppConfig<K extends keyof typeof config>(key: K): typeof config[K] {
  return config[key];
}