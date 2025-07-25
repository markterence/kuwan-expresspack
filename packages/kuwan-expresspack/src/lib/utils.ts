import crypto from 'node:crypto';
import { colorize, type ColorName } from 'consola/utils';
import node_path from 'node:path'; 
import { fileURLToPath } from 'url';

// Obtained from NodeREPL: `> require("node:http").METHODS`
export const HTTP_METHODS = [
  'ACL',        'BIND',        'CHECKOUT',
  'CONNECT',    'COPY',        'DELETE',
  'GET',        'HEAD',        'LINK',
  'LOCK',       'M-SEARCH',    'MERGE',
  'MKACTIVITY', 'MKCALENDAR',  'MKCOL',
  'MOVE',       'NOTIFY',      'OPTIONS',
  'PATCH',      'POST',        'PROPFIND',
  'PROPPATCH',  'PURGE',       'PUT',
  'QUERY',      'REBIND',      'REPORT',
  'SEARCH',     'SOURCE',      'SUBSCRIBE',
  'TRACE',      'UNBIND',      'UNLINK',
  'UNLOCK',     'UNSUBSCRIBE'
];

export const colorizeHTTPMethod = (method: string): string => {
  let colorName: ColorName = 'gray';
  const _method = method.toUpperCase();
  switch (_method) {
    case 'GET':
      colorName = 'green';
      break;
    case 'POST':
      colorName = 'blue';
      break;
    case 'PUT':
      colorName = 'yellow';
      break;
    case 'DELETE':
      colorName = 'red';
      break;
    case 'PATCH':
      colorName = 'magenta';
      break;
    case 'HEAD':
      colorName = 'cyan';
      break;
    case 'TRACE':
      colorName = 'white';
      break;
    default:
      colorName = 'gray';
      break;
  }

  return colorize(colorName, _method);
}


/**
 *  just adds the os separator to the end of the path
 *  for logging purposes
 */
export function logPath(path: string): string {
  if (!path) return '';
  const sep = node_path.sep;
  if (path.endsWith(sep)) return path;
  return path + sep;
}

export function resolveAppRoot(importMetaUrl: string): string {
  return node_path.dirname(fileURLToPath(importMetaUrl))
}
