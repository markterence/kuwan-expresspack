import consola from 'consola'; 

console.log('EXPRESSPACK_LOG_LEVEL set to:', process.env.EXPRESSPACK_LOG_LEVEL);
/**
 * This is the internal logger
 */
const logger = consola.create({
    level: Number.isNaN(Number(process.env.EXPRESSPACK_LOG_LEVEL)) ? 3 : Number(process.env.EXPRESSPACK_LOG_LEVEL),
})

/**
 * @internal
 * Set the logger level from the `EXPRESSPACK_LOG_LEVEL` env variable.
 * This is useful when the logger is used before the env variables are loaded.
 */
export function setLoggerLevelFromEnv() {
  const val = Number(process.env.EXPRESSPACK_LOG_LEVEL);
  logger.level = Number.isNaN(val) ? 3 : val;
}
export default logger;