import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
import packageJson from '../../package.json';
import consola from 'consola';
export default function generateConfigTypeDefinitions(root, configFiles: { topic: string, configPath: string }[]) {

    const typeEntries = configFiles.map(
        c => `    ${c.topic}: typeof import('${c.configPath}').default;`
    );

    const typeFile = `
declare module 'expresspack/config' {
    const config: AppConfig;
    export default config;
    export function getAppConfig<K extends keyof AppConfig>(key: K): AppConfig[K];

    export interface AppConfig {
        ${typeEntries.join('\n')}
    }
}
`.trim();

    const packageName = packageJson.name;

    // TODO: This needs fixing and guaranteeing that the path is correct.
    const cwd = process.cwd();
    const user_space_node_modules_path = path.resolve(cwd, 'node_modules');
    const generatedTypesDir = path.join(user_space_node_modules_path, packageName, '.types'); 

    consola.debug({
        cwd,
        user_space_node_modules_path,
        generatedTypesDir,
    })
    
    if (!fs.existsSync(generatedTypesDir)) {
        fs.mkdirSync(generatedTypesDir, { recursive: false });
        consola.debug('Created directory:', generatedTypesDir);
    }

    fs.writeFileSync(path.join(generatedTypesDir, 'config.d.ts'), typeFile);
    consola.debug('Generated types at:', path.join(generatedTypesDir, 'config.d.ts'));
}