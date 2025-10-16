import { z } from 'zod';

export function parseEnv<T extends z.ZodType>(schema: T, env: Record<string, string | undefined>): z.infer<T> | undefined {
  const result = schema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(z.prettifyError(result.error));
  }

  return result?.data;
}

/**
 * Load env with types and validation from a Zod schema
 *
 * @param appRoot
 * @param zodSchema
 * @param env
 */
export function create<T extends z.ZodType>(
  appRoot: string | URL,
  zodSchema: T,
  env?: Record<string, string | undefined>,
): z.infer<T> {
  const parsedEnv = parseEnv(zodSchema, env || process.env);
  //   return parsedEnv ?? {};
  return (parsedEnv || {}) as z.infer<T>;
}

/**
 * Helper type to infer the environment variable types from a Zod schema
 *
 * @example
 * ```
 * export type Env = InferEnv<typeof envSchema>;
 * ```
 */
export type InferEnv<T extends z.ZodType> = z.infer<T>;

export default {
  create,
  parseEnv,
};
