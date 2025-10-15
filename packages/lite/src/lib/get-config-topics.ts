import { glob } from 'tinyglobby';

const GLOB_PATTERN = '*.{js,ts,mjs,cjs,mts,cts}';
const IGNORED_PATTERNS = [
    /* Ignore definitions and source-maps */
    '!*.d.{ts,mts,mjs,cts}', '!*.map', 
];
/**
 * Get all unique config topics from the config directory
 * 
 * Example: `config/<topic>.{js,ts,mjs,cjs,mts,cts}`
 */
export async function getConfigTopics(configDir: string): Promise<string[]> {
    const configFiles = await glob([
        GLOB_PATTERN,
        ...IGNORED_PATTERNS
    ], {
        cwd: configDir,
    })

    // Extract unique topics (filenames without extensions)
    const topics = new Set<string>()
    
    configFiles
        .forEach(file => {
            const topic = file.replace(/\.(js|ts|mjs|cjs|mts|cts)$/, '')
            topics.add(topic)
        })
    
    return Array.from(topics);
}