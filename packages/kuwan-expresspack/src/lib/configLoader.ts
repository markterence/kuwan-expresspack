import consola from 'consola' 
import { join, relative } from 'node:path'
import { glob } from 'tinyglobby';

import { checkDir, getFileCandidate, getRelativeFilePath, resolveAppPaths } from './resolveAppPaths';

import { globalConfigMap } from '../store';
import { logPath } from './utils';


// Ignore TypeScript declaration files and source maps
// but it seems glob can do that for us.
function isValidConfigFile(filename: string): boolean {
    // Exclude source maps (.js.map, .ts.map, etc.)
    if (filename.includes('.map')) return false
    
    // Exclude TypeScript declaration files (.d.ts, .d.mts, .d.cts)
    if (filename.match(/\.d\.(ts|mts|cts)$/)) return false
    
    return true
}

/**
 * Get all unique config topics from the config directory
 * 
 * Example: `config/<topic>.{js,ts,mjs,cjs,mts,cts}`
 */
async function getConfigTopics(configDir: string): Promise<string[]> {
    // maybe also add glob to not include source maps and declaration files?
    const configFiles = await glob('*.{js,ts,mjs,cjs,mts,cts}', {
        cwd: configDir,
        ignore: ['*.d.ts', '*.d.mts', '*.d.mjs', '*.d.cts', '*.map'],
    })

    // Extract unique topics (filenames without extensions)
    const topics = new Set<string>()
    
    configFiles
        .forEach(file => {
            const topic = file.replace(/\.(js|ts|mjs|cjs|mts|cts)$/, '')
            topics.add(topic)
        })
    
    return Array.from(topics)
}


/**
 * Load all configurations from the config directory
 * 
 * We don't pass context here because we are not using it.
 * since this is config loading is done before the app is created.
 */
export async function loadAllConfigs(root: string): Promise<void> { 
    const { config: configPath } = resolveAppPaths(root);
    const configDir = configPath.base;

    consola.debug('Loading all configurations from:', logPath(relative(root, configPath.base)));

    const dir = checkDir(configDir);
    if (!dir) {
        consola.debug('No config directory found. Looked for:', configDir);
        return
    }

    const topics = await getConfigTopics(configDir)
    consola.debug(`Found ${topics.length} config files:\r\n   ${topics.join('\r\n   ')}`)
    
    for (const topic of topics) {
        const configPath = getFileCandidate(join(configDir, topic))
        
        if (!configPath) {
            consola.warn(`No config file found for topic: ${topic}`)
            continue
        }
        
        try {
            const configModule = await import(configPath)
            let configValue = configModule.default || configModule
            
            // Handle factory functions
            if (typeof configValue === 'function') {
                configValue = await configValue()
            }
            
            globalConfigMap.set(topic, configValue)
            
            const fileName = configPath.split('/').pop()
            consola.debug(`Loaded config: ${topic} from ${fileName}`)
        } catch (error) {
            consola.error(`Failed to load config ${topic}:`, error)
        }
    }
}