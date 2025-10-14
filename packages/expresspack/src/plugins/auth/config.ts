/**
 * Configuration definer for better-auth
 */ 
import { env } from "node:process";
import type { AuthOptions } from "./types";
export type DefineAuthConfig = (def?: AuthOptions) => AuthOptions;
 
export const defineConfig: DefineAuthConfig = (def?: AuthOptions) => {
    const BETTER_AUTH_SECRET = env.AUTH_SECRET || env.BETTER_AUTH_SECRET;
    const BETTER_AUTH_URL = env.AUTH_URL || env.BETTER_AUTH_URL;

    const baseURL = def?.baseURL || BETTER_AUTH_URL;
    const secret = def?.secret || BETTER_AUTH_SECRET;

    if (!BETTER_AUTH_SECRET) {
        const error = new Error(`You must set the AUTH_SECRET environment variable`);
        error.name = 'AuthConfigError';
        error.stack = '';
        throw error;
    }

    if (!BETTER_AUTH_URL) {
        const error = new Error(`You must set the AUTH_URL environment variable.`);
        error.name = 'AuthConfigError';
        error.stack = '';
        throw error; 
    }

    return {
        ...def,
        baseURL,
        secret,
    };
}