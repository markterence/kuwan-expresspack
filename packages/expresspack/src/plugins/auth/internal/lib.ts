import logger from "../../../logger";
import type { DefineAuthConfig } from "../config";
import process from "node:process";


export async function isDefineAuthConfig(fn: unknown) {
 
    return typeof fn === 'function' && fn.length === 1;
}

export function assertDefineAuthConfig(fn: unknown): asserts fn is DefineAuthConfig {
    if (!isDefineAuthConfig(fn)) {
        throw new Error('Function does not match DefineAuthConfig signature');
    }
}

function exitWithConfigError(message: string, topic: string = 'auth'): never {
    const error = new Error(`AuthConfigError [ExpressPack Config] ${topic}: ${message}`);
    error.name = 'AuthConfigError';
    error.stack = '';
    logger.fatal(error);
    process.exit(1);
}

export async function  assertDefineAuthConfigAndExit(fn: any, ctx: any): Promise<void> {
    throw new Error('not implemented, hard to check type');
    // if (!isDefineAuthConfig(fn)) { 
    //     const resultValue = typeof fn === 'object' ? (
    //         Object.keys(fn as any).length === 0 ? undefined : typeof fn
    //     ) : typeof fn;
 
        
    //     exitWithConfigError(
    //         `Invalid auth configuration function. Does not match DefineAuthConfig signature. Expected a function with 1 parameter, got ${resultValue}`,
    //         ctx.configPath || 'auth'
    //     ); 
    // }
}