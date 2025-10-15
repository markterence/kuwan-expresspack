
export type Importer<T extends (...args: any[]) => any> = () => Promise<{ default: T }>;

/**
 * dynamicImport
 * 
 * A reusable utility for dynamic importing of handlers, listeners, or generic callback functions in Node.js projects.
 * 
 * This function returns an async handler that, when invoked, will dynamically import 
 * the module using the provided importer function and immediately execute the module's 
 * default export with the supplied arguments.
 * 
 * ## Usage Examples
 * 
 * ### Event Handler
 * ```typescript
 * // events.ts
 * emitter.on('USER_REGISTERED', dynamicImport(() => import('./listeners/welcomeUser')));
 * 
 * // ./listeners/welcomeUser.ts
 * export default async function welcomeUser(user) {
 *   // Send welcome email or perform other actions
 *   console.log(`Welcome, ${user.name}!`);
 *   await sendRegisterEmail(payload);
 *   await notifyWelcome(payload);
 * }
 * ```
 * 
 * ### Generic Node.js Example
 * Suppose you have a module at `./utils/greet.ts`:
 * ```typescript
 * // ./utils/greet.ts
 * export default function(name: string) {
 *   console.log(`Hello, ${name}!`);
 * }
 * ```
 * 
 * You can dynamically import and invoke this function like so:
 * ```typescript
 * const greet = dynamicImport(() => import('./utils/greet'));
 * await greet('Alice');
 * // Output: Hello, Alice!
 * ```
 * 
 * ## Parameters
 * - importer: A function returning a Promise that resolves to an object with a default export (your handler function).
 * 
 * ## Returns
 * - An async function that calls the imported module's default export with the provided arguments.
 * 
 * @template T - The function type (e.g., listener, handler, callback).
 * @param importer - Function that returns a promise resolving to a module with a default export of type T.
 * @returns An async function of type T.
 */
export function dynamicImport<T extends (...args: any[]) => any>(
  importer: Importer<T>
): T {
  return (async (...args: Parameters<T>) => {
    const { default: handler } = await importer();
    return handler(...args);
  }) as T;
}