import consola from "consola";
import { getFileCandidate, resolveAppPaths } from "./resolveAppPaths";
import { CONFIG_ID as APP_CONFIG_ID, DEFAULT_CONFIG as DEFAULT_APP_CONFIG } from "../core/app-config";
import { globalConfigMap } from "../store";


export async function loadAppConfig(root: string): Promise<void> {
    const { config: configPath } = resolveAppPaths(root);
    const appConfigFile = configPath.appConfigFile;

    const file = getFileCandidate(appConfigFile);
    if (!file) {
        consola.warn(`No app config file found: ${file}`);
        globalConfigMap.set(APP_CONFIG_ID, DEFAULT_APP_CONFIG)
    }

    if(file) {
        try {
            const configModule = await import(file)
            let configValue = configModule.default || configModule
              globalConfigMap.set(APP_CONFIG_ID, configValue)
        }  catch (error) {
            consola.error(`Failed to load config/app.ts:`, error)
        }
    }
}