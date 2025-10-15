import logger from './logger';
import { join, relative } from 'node:path'

import { checkDir, getFileCandidate, resolveAppPaths } from './lib/resolve-path';
import { logPath } from './lib/utils';
import config from './config';
import { getConfigTopics } from './lib/get-config-topics';

/**
 * Load all configurations from the config directory
 * 
 * We don't pass context here because we are not using it.
 * since this is config loading is done before the app is created.
 */
export async function configLoader(root: string): Promise<void> { 
    const { config: configPath } = resolveAppPaths(root);
    const configDir = configPath.base;

    logger.debug('Loading all configurations from: '+ logPath(relative(root, configPath.base)));

    const dir = checkDir(configDir);
    if (!dir) {
        logger.debug('No config directory found. Looked for:', configDir);
        return;
    }

    const topics = await getConfigTopics(configDir);
    logger.debug(`Found ${topics.length} config files: %s`, `\n   ${topics.join('\n   ')}`);

    const configFiles = new Set<{ topic: string, configPath: string }>();

    for (const topic of topics) {
        const configPath = getFileCandidate(join(configDir, topic));
        
        if (!configPath) {
            logger.warn(`No config file found for topic: ${topic}`);
            continue;
        }
        
        try {
            const configModule = await import(configPath);
            let configValue = configModule.default || configModule
          
            // Handle factory functions
            if (typeof configValue === 'function') {
                configValue = await configValue()
            } 
            // globalConfigMap.set(topic, configValue)
            const topicCamelCase = topic.replace(/[-_](\w)/g, (_, c) => c ? c.toUpperCase() : ''); 
            config[topicCamelCase] = configValue
           
            const fileName = configPath.split('/').pop()
            logger.debug(`Loaded config: ${topicCamelCase} from ${fileName}`)
            
            // For type generation, no need to generate types in production
            // if (process.env.NODE_ENV !== 'production') {
            //     configFiles.add({ topic: topicCamelCase, configPath });
            // }

            // Config signature validator (not implemented for now)
            // verifyConfigSignature(configModule.default || configModule, topicCamelCase, configPath);

        } catch (error) {
            logger.error(`Failed to load config ${topic}:`, error)
        }

    }

    // Temporarily disable type generation.
    // Provided a CLI command to generate types instead.
    // if(process.env.NODE_ENV !== 'production') {
    //     // Generate type definitions for the config
    //     logger.debug('Generating type definitions for config files...');
    //     // logger.info('config: ' + configPath);
    //     generateConfigTypeDefinitions(root, Array.from(configFiles));
    // }
}
