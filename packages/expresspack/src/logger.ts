import consola from 'consola';
const logLevel = process.env.EXPRESSPACK_LOG_LEVEL;

const logger = consola.create({
    level: Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel),
})

export default logger;