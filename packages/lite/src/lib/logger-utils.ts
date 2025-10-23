
import { colorize } from 'consola/utils'
 
/**
 * Alias for `colorize` from `consola/utils`
 */
export const cz = colorize;
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
