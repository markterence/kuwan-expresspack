import fs from 'node:fs';
import path from 'node:path';
import { getConfigTopics } from './get-config-topics';
import { getFileCandidate } from './resolve-path';

interface ConfigTypegenCmdOptions {
    output: string;
    configDir: string;
    cwd: string;
}

const typeFileTemplate = (typeEntries: string[]) => `
// This file is auto-generated. Do not edit directly.
declare module 'kuwan-expresspack-core/config' {
    const config: AppConfig;
    export default config;
    export function getAppConfig<K extends keyof AppConfig>(key: K): AppConfig[K];
    
    export interface AppConfig {
        ${typeEntries.join('\r\n\t\t')}
    }
}`.trim();

const buildTypeEntry = (topic: string, importPath: string) => {
    return `${topic}: typeof import('${importPath}').default;`;
};

export default async function configTypegenCmd(options: ConfigTypegenCmdOptions) {
    const topics = await getConfigTopics(options.configDir);
    console.log(`Found ${topics.length} config files: \n   ${topics.join('\n   ')}`);
    const typeEntries: string[] = [];

    for (const topic of topics) {
        const configPath = getFileCandidate(path.join(options.configDir, topic));
        
        if (!configPath) {
            console.warn(`No config file found for topic: ${topic}`);
            continue;
        }

        try { 
            const configAbsPath = path.normalize(path.resolve(options.cwd, configPath));
            const outputAbsPath = path.normalize(path.resolve(options.cwd, options.output));
          
            const relativeImportPath = path.posix.relative(
                path.dirname(outputAbsPath),
                configAbsPath
            );

            const topicCamelCase = topic.replace(/[-_](\w)/g, (_, c) => c ? c.toUpperCase() : ''); 
            const typeEntry = buildTypeEntry(topicCamelCase, relativeImportPath.startsWith('.') ? relativeImportPath : `./${relativeImportPath}`);
            typeEntries.push(typeEntry);
        } catch (error) {
            console.warn(`Failed to process config file for topic: ${topic}`, error);
        }
    }

    const typeFileContent = typeFileTemplate(typeEntries);

    try {
        const outputAbsPath = path.normalize(path.resolve(options.cwd, options.output));
        console.log('Output path resolved to:', outputAbsPath);
        const outputDir = path.dirname(outputAbsPath); 
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: false });
            console.log('Created directory:', outputDir);
        }
        
        fs.writeFileSync(outputAbsPath, typeFileContent);
        console.log('Generated types at:', outputAbsPath);
    } catch (error) {
        console.error('Failed to generate config types.', error);
        process.exit(1);
    }
}