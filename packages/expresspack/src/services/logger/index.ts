import consola, { type ConsolaInstance } from 'consola';
import { env } from 'node:process';
const logLevel = env.APP_LOG_LEVEL;

export const println = consola.create({
    level: Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel) 
})

export function useConsoleLogger(name: string): ConsolaInstance {
    return println.withTag(name);
}