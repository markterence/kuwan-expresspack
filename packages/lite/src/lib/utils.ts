import node_path from 'node:path';

export function logPath(path: string): string {
  if (!path) return '';
  const sep = node_path.sep;
  if (path.endsWith(sep)) return path;
  return path + sep;
}
