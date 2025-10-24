/*
 * @poppinss/utils
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
 
// export class MaybeAsync
/**
 * Dynamically import a module and ensure it has a default export
 */
export async function importDefault<T extends object>(
  importFn: () => Promise<T>,
  filePath?: string
): Promise<T extends { default: infer A } ? A : never> {
  const moduleExports = await importFn()
  /**
   * Make sure a default export exists
   */
  if (!moduleExports || !('default' in moduleExports)) {
    const errorMessage = filePath
      ? `Missing "export default" in module "${filePath}"`
      : `Missing "export default" from lazy import "${importFn}"`

    throw new Error(errorMessage, {
      cause: {
        source: importFn,
      },
    })
  }

  return moduleExports.default as Promise<T extends { default: infer A } ? A : never>
}
