import consola, { type ConsolaInstance, type ConsolaOptions } from 'consola';
import { env } from 'node:process';
const logLevel = env.APP_LOG_LEVEL;

export const println = consola.create({
    level: Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel) 
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
    const logger = consola.create({
        level: options.level ?? (Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel))
    })
    return logger.withTag(name);
}

export const Logger = useConsoleLogger;
