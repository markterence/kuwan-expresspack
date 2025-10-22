import consola from 'consola'; 
import { colorize } from 'consola/utils'
 
const logLevel = process.env.EXPRESSPACK_LOG_LEVEL;
/**
 * This is the internal logger
 */
const logger = consola.create({
    level: Number.isNaN(Number(logLevel)) ? 3 : Number(logLevel),
})

/**
 * Colorize primitive values for console logging
 */
export function cl(val: string | number | bigint | boolean | symbol | null | undefined): string {
  switch (typeof val) {
    case 'number':
    case 'bigint':
      return colorize('cyan', val.toString()); // numeric values → cyan

    case 'boolean':
      return colorize(val ? 'green' : 'red', String(val)); // true=green, false=red

    case 'symbol':
      return colorize('magenta', val.toString()); // symbols → magenta

    case 'string': 
      // if numeric string
      if (!isNaN(Number(val))) {
        return colorize('yellow', `'${val}'`);
      }
      return colorize('whiteBright', `${val}`);

    case 'undefined':
      return colorize('gray', 'undefined');
  }

  if (val === null) {
    return colorize('dim', 'null');
  }

  return String(val);
}

export default logger;