import path from 'node:path';
import fs from 'node:fs';
import packageJson from '../../package.json';
import consola from 'consola';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJSONPath = path.resolve(__dirname, '..' , 'package.json');
const packagePath = path.dirname(packageJSONPath);

export default function generateConfigTypeDefinitions(root, configFiles: { topic: string, configPath: string }[]) {

    const typeEntries = configFiles.map(
        c => `${c.topic}: typeof import('${c.configPath}').default;`
    );

    const typeFile = `
declare module 'kuwan-expresspack-core/config' {
    const config: AppConfig;
    export default config;
    export function getAppConfig<K extends keyof AppConfig>(key: K): AppConfig[K];

    export interface AppConfig {
        ${typeEntries.join('\n')}
    }
}
`.trim();

    const packageName = packageJson.name;

    // TODO: This cwd() needs fixing and guaranteeing that the path is correct
    // const cwd = process.cwd(); 
    let modulePath = packagePath;
 
    // const user_space_node_modules_path = path.resolve(modulePath, 'node_modules');
    // const generatedTypesDir = path.join(user_space_node_modules_path, packageName, '.types'); 
    const generatedTypesDir = path.join(modulePath, '.types'); 

    consola.debug({
        modulesPath: packagePath,
        generatedTypesDir
    });
    
    try {
        if (fs.existsSync(modulePath)) {

            if (!fs.existsSync(generatedTypesDir)) {
                fs.mkdirSync(generatedTypesDir, { recursive: false });
                consola.debug('Created directory:', generatedTypesDir);
            }

            fs.writeFileSync(path.join(generatedTypesDir, 'config.d.ts'), typeFile);
            consola.debug('Generated types at:', path.join(generatedTypesDir, 'config.d.ts'));

        }
    } catch (error) {
        consola.debug('Failed to generate config types. This warning can be ignored.', error);
    }
}