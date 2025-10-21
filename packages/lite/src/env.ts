import { z } from 'zod';


function parseEnv<T>(
  schema: z.ZodObject,
  env: Record<string, string | undefined>
): Record<string, any> | undefined {
  const result = schema.safeParse(env);
  if (result.success) {
    return result.data;
  } else {
    console.error('❌ Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    return undefined;
  }
}
// export function parseEnv<T extends z.ZodType>(schema: T, env: Record<string, string | undefined>): z.infer<T> | undefined {
//   const result = schema.safeParse(env);

//   if (!result.success) {
//     console.error('❌ Invalid environment variables:');
//     console.error(z.prettifyError(result.error));
//   }

//   return result?.data;
// }




/**
 * Load env with types and validation from a Zod schema
 */
export function create<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> | undefined {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    return undefined;
  }
  return result.data;
}
// export function create<T>(
//   appRoot: string | URL,
//   zodSchema: z.ZodObject,
//   env?: Record<string, string | undefined>,
// ): Record<string, any> | T {
//   const parsedEnv = parseEnv(zodSchema, env || process.env);
//   return parsedEnv ?? {} as T;
// }

// ...existing code...

/**
 * Helper type to infer the environment variable types from a Zod schema
 *
 * @example
 * ```
 * export type Env = InferEnv<typeof envSchema>;
 * ```
 */
// export type InferEnv<T extends z.ZodType> = z.infer<T>;

export default {
  create,
  parseEnv,
};
