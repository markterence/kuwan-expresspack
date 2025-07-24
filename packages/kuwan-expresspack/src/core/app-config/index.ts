export type ApplicationConfig = {
    appPort: number;
    [k: string]: any
}
export const CONFIG_ID = 'app';
export const DEFAULT_CONFIG: ApplicationConfig = {
    appPort: 1337
}
export function defineConfig(config: ApplicationConfig) {
    return config;
}