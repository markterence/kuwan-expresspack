import consola, { type ConsolaInstance, type ConsolaOptions } from 'consola';
import { env } from 'node:process';

export const println = consola.create({
    level: Number.isNaN(Number(env.APP_LOG_LEVEL)) ? 3 : Number(env.APP_LOG_LEVEL) 
})

/**
 * Create a console logger with a specific name. Uses the log-level specified in `APP_LOG_LEVEL` env variable.
 */
export function useConsoleLogger(name: string): ConsolaInstance {
    return println.withTag(name);
}

/**
 * Create a console logger allowing to specify log level in options.
 */
export function createConsoleLogger(name: string, options: Partial<Pick<ConsolaOptions, "level">>): ConsolaInstance {
    const logLevel = process.env.APP_LOG_LEVEL;
    const logger = consola.create({
        level: options.level ?? (Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel))
    })
    return logger.withTag(name);
}

export const Logger = useConsoleLogger;
