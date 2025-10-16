import type {
  RootOperationNode,
  LogEvent,
} from 'kysely'

export type KyselyLoggerParams = {
  sql: string
  params: readonly unknown[]
  duration: number
  queryNode?: RootOperationNode
  error?: unknown
}
export type KyselyLoggerOptions = {
  logger: (data: KyselyLoggerParams) => void,
  merge: boolean,
  logQueryNode: boolean,
}
/**
 * Obtained from:
 * https://github.com/subframe7536/kysely-sqlite-tools/blob/master/packages/sqlite-utils/src/logger.ts
 *
 * The goal was to log the SQL and parameters of the query executed by Kysely instead
 * of having the SQL logs with the question marks.
 */
export function createKyselyLogger(options: KyselyLoggerOptions) {
  const { logger, merge, logQueryNode } = options;
 
  return (event: LogEvent) => {
    const { level, queryDurationMillis, query: { parameters, sql, query } } = event;
    const questionMarker = '__Q__';
    const err = level === 'error' ? event.error : undefined;
    let _sql = sql.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
    if (merge) {
      parameters.forEach((param) => {
        let data = param;
        if (param instanceof Date) {
          data = param.toLocaleString();
        }
        if (typeof data === 'string') {
          data = `'${data}'`.replace(/\?/g, questionMarker);
        }
        _sql = _sql.replace(/\?/, data as any);
      });
    }
 
    const param: KyselyLoggerParams  = {
      sql: _sql.replace(new RegExp(questionMarker, 'g'), '?'),
      params: parameters,
      duration: queryDurationMillis,
      error: err,
    };
    if (logQueryNode) {
      param.queryNode = query;
    }
    logger(param);
  };
} 
