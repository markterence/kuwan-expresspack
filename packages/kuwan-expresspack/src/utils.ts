/** 
 * Exported Utils
*/

import consola from 'consola';
import { glob } from 'tinyglobby';
import path from 'node:path';
export async function modularRoutesImport(
    folder: string,
) {
    consola.debug(`Importing modular routes from folder: ${folder}`);
    if (!folder) {
        throw new Error('Folder path is required for modular routes import');
    }
    const modules = await glob([
        `*/routes.mts`,
        `*/routes.ts`,
        `*/routes.mjs`,
        `*/!routes.d.ts`,
        `*/!routes.d.mts`,
        `*/!routes.d.mjs`,
    ], {
        cwd: folder,
    });

    modules.forEach((file) => { 
        consola.debug(`Importing module: ${file}`);
        import(path.join(folder, file)).catch((error) => {
            console.error(`Failed to import module ${file}:`, error);
        });
    });
}