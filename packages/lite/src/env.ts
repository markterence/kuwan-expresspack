import { z } from 'zod';
import { config as dotEnvXConfig, type DotenvConfigOptions, type DotenvConfigOutput, type DotenvParseOutput } from '@dotenvx/dotenvx';
import { cz, cl } from './lib/logger-utils';

import logger, { setLoggerLevelFromEnv } from './logger';
// const logger = consola.create({
//   level: Number(process.env.APP_LOG_LEVEL)
// });

export interface EnvOptions {
  /**
   * If true, throw an error on validation failure. 
   * This will stop the application from starting
   * if the environment variables are invalid.
   */
  fatal?: boolean;

  /**
   * If true, log errors immediately when validation fails.
   * This will usually show at the start of the application logs.
   * If false, no logs will be made. Errors can then be logged manually using `getEnvErrorString()` or `getEnvErrorRaw()`.
   * 
   * This only works when `fatal` is false.
   */
  immediate_log_error?: boolean;

  /**
   * If true, log errors after the application has started gracefully.
   * Only works when using the provided graceful start handler included in this package. 
   * 
   * Set to `false` to disable logging after graceful start.
   */
  log_error_after_graceful_start?: boolean;
} 

let parsedEnv: DotenvParseOutput | undefined = undefined;
let envErrorString: string | null = null;
let envErrorRaw: z.ZodError | null = null;

/**
 * @private
 * This is only populated by `Env.create()`.
 */
let globalOptions: Partial<EnvOptions> = {};
/**
 * @private 
 * Keys of the zod schema, used to mark if the env var is defined in the schema.
 */
let schemaKeys: string[] = [];

/**
 * This function is no longer maintained and was used
 * only for `Env.create()` before to parse and exposed for convenience.
 * 
 * `Env.create()` has it's own internal parsing logic now.
 * 
 * This caused type inference issues with zod schema leading 
 * to "Typescript infinite instantiation" error.
 * 
 * @deprecated Write your own parsing logic using zod directly or use `Env.create()` to validate env variables against a zod schema.
 */
function parseEnv<T>(
  schema: z.ZodObject,
  env: Record<string, string | undefined>
): Record<string, any> | undefined {
  const result = schema.safeParse(env);
  if (result.success) {
    return result.data;
  } else {
    console.error('❌ Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    return undefined;
  }
}
// export function parseEnv<T extends z.ZodType>(schema: T, env: Record<string, string | undefined>): z.infer<T> | undefined {
//   const result = schema.safeParse(env);

//   if (!result.success) {
//     console.error('❌ Invalid environment variables:');
//     console.error(z.prettifyError(result.error));
//   }

//   return result?.data;
// }



/**
 * Load env with types and validation from a Zod schema
 */
export function create<T extends z.ZodObject>(schema: T, data: unknown, options: Partial<EnvOptions> = {
  fatal: false,
  immediate_log_error: true,
  log_error_after_graceful_start: true,
}): z.infer<T> | undefined | {} {
  globalOptions = options;
  if (options.fatal) {
    // Throw error on validation failure
    try {
      const result = schema.parse(data);
      return {
        ...parsedEnv,
        ...result
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        envErrorString = z.prettifyError(error);
        envErrorRaw = error;
        // Since this is a throwing error, this should be logged immediately.
        logger.error('❌ Invalid environment variables:', );
        logger.error('❌', envErrorString);
        throw new Error('Invalid environment variables. The environment variable did not pass the schema validation. Check if you have set all required environment variables correctly.');
      } 
      throw error;
    }
  }

  const result = schema.safeParse(data);
  // When parsing fails, return partial data with undefined for missing keys
  if (!result.success) {
    // make everything optional and parse again to get partial data
    // This makes missing env vars to be undefined to prevent runtime errors
    // like `Cannot read property 'XYZ' of undefined`.
    const partialEnv = schema.partial().safeParse(data); 
    if (!partialEnv.success) {
      // This should never happen since we are making everything optional
      // Still return something to satisfy the return type and make it work like dotenv
      envErrorString = z.prettifyError(result.error);
      envErrorRaw = result.error;
      if (options.immediate_log_error) {
        logger.error('❌ Invalid environment variables:');
        logger.error('❌', envErrorString);
      }
      return parsedEnv || {};
    }

    envErrorString = z.prettifyError(result.error);
    envErrorRaw = result.error;
    if (options.immediate_log_error) {
      logger.error('❌ Invalid environment variables:');
      logger.error('❌', envErrorString);
    }
    
    // .keyof(), this are the keys defined in the schema
    const keys = schema.keyof(); 
    schemaKeys = keys.options;
 
    // The partial'ed schema will not have missing keys, but those missing will have `undefined` values.
    // We must include those missing keys so it will show in the logs.
    for (const key of keys.options) {
      if (!(key in partialEnv.data)) {
        (partialEnv.data as Record<string, any>)[key] = undefined;
      }
    }

    return {
      ...parsedEnv,
      ...partialEnv.data,
    };
  }

  const keys = schema.keyof(); 
  schemaKeys = keys.options;
  return {
    ...parsedEnv,
    ...result.data
  };
}

export function getEnvErrorRaw(): z.ZodError | null {
  return envErrorRaw;
}

/**
 * @returns Formatted string of environment variable validation error.
 * The format is the exact same as zod's `prettifyError` output.
 */
export function getEnvErrorString(): string | null {
  return envErrorString;
}

/**
 * Does not log to console, just returns the formatted string.
 */
export function prettifyEnv(env: Record<string, any>): string | undefined {
  if (!env || Object.keys(env).length === 0) {
    // Do not try to print, Infinity error may happen on .repeat(keyWidth - 3)
    logger.warn('No environment variables to print. Make sure the env is complete and valid.'); 
    return;
  }
  
  const dimNotInSchema = (key: string): string => {
    if (schemaKeys.includes(key)) {
      return key;
    } else {
      return cz('dim',`${key}`);
    }
  }
  const markNotInSchema = (key: string): string => {
    if (schemaKeys.includes(key)) {
      return key;
    } else {
      return `* ${key}`;
    }
  }
  
  const envEntries = Object.entries(env).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [markNotInSchema(key), value]);

  const keyWidth = Math.max(...envEntries.map(([key]) => key.length)) + 2;
  const lines = envEntries.map(([key, value]) => {
    const paddedKey = key.padEnd(keyWidth, ' ');
    // .replace to fix broken padding due to ansi codes
    const mKey = paddedKey.replace(key, dimNotInSchema(key));
    return `${mKey} ${cl(value)}`;
  });
  // pad the "VALUE" header column
  const header = `KEY${' '.repeat(keyWidth - 3)} VALUE`;
  const spacer = ' '.repeat(header.length);
  const formattedEnv = [spacer,header, spacer, ...lines].join('\n');
  return formattedEnv;
}

/**
 * This is a convenience function to log env errors manually.
 * Errors are already logged after by graceful start.
 */
export function logEnvErrors() {
  if (globalOptions) {
    const { log_error_after_graceful_start } = globalOptions;
    if (log_error_after_graceful_start) {
      const errLogStr = getEnvErrorString();
      if (errLogStr) {
        logger.error(`Invalid Environment Variable Value`, `\n-----\n${errLogStr}\n-----`);
      }
    }
  }
}

// Similar to @dotenvx/config but configured to work with our Env.create()
export function config(options?: DotenvConfigOptions | undefined) {
  parsedEnv = {};
  const result = dotEnvXConfig(options);
  setLoggerLevelFromEnv()
  parsedEnv = (result.parsed) ? result.parsed : undefined;
  return result as DotenvConfigOutput;
 
}
 

export default {
  create,
  parseEnv,
  prettifyEnv,
  getEnvErrorRaw,
  getEnvErrorString,
  logEnvErrors,
  config,
};
