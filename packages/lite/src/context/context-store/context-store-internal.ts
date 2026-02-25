import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Application context with typed access methods
 */
export interface AppContext<TData extends Record<string, any> = Record<string, any>> {
    /**
     * Get a value from the context store
     * 
     * @param key - The key to retrieve
     * @returns The stored value or undefined
     * 
     * @example
     * ```typescript
     * interface MyContext {
     *     user: { id: number; name: string };
     *     tenantId: string;
     * }
     * 
     * const ctx = getAppContext<MyContext>();
     * const user = ctx.get('user'); // type is { id: number; name: string } | undefined
     * ```
     */
    get<K extends keyof TData>(key: K): TData[K] | undefined;
    
    /**
     * Set a value in the context store
     * 
     * @param key - The key to store the value under
     * @param value - The value to store
     * 
     * @example
     * ```typescript
     * const ctx = getAppContext<MyContext>();
     * ctx.set('user', { id: 1, name: 'John' }); // fully typed
     * ```
     */
    set<K extends keyof TData>(key: K, value: TData[K]): void;
    
    /**
     * Check if a key exists in the context store
     * 
     * @param key - The key to check
     * @returns True if the key exists
     */
    has<K extends keyof TData>(key: K): boolean;
    
    /**
     * Delete a value from the context store
     * 
     * @param key - The key to delete
     * @returns True if the key existed and was deleted
     */
    delete<K extends keyof TData>(key: K): boolean;
    
    /**
     * Clear all values from the context store
     */
    clear(): void;
}

/**
 * Internal context structure
 */
export interface InternalContext<TData extends Record<string, any> = Record<string, any>> {
    data: Map<keyof TData, any>;
}

/**
 * AsyncLocalStorage instance for managing context
 */
export const asyncLocalStorage = new AsyncLocalStorage<InternalContext<any>>();

/**
 * Create a typed context proxy from internal context
 */
export function createContextProxy<TData extends Record<string, any>>(
    internal: InternalContext<TData>
): AppContext<TData> {
    return {
        get<K extends keyof TData>(key: K): TData[K] | undefined {
            return internal.data.get(key);
        },
        set<K extends keyof TData>(key: K, value: TData[K]): void {
            internal.data.set(key, value);
        },
        has<K extends keyof TData>(key: K): boolean {
            return internal.data.has(key);
        },
        delete<K extends keyof TData>(key: K): boolean {
            return internal.data.delete(key);
        },
        clear(): void {
            internal.data.clear();
        },
    };
}

/**
 * Get the current application context with custom type support
 * 
 * @throws {Error} If called outside of context
 * @returns {AppContext<TData>} The current context
 * 
 * @example
 * ```typescript
 * import { getAppContext } from 'expresspack';
 * 
 * interface MyContext {
 *     user: { id: number; name: string };
 *     tenantId: string;
 * }
 * 
 * export function someHandler(req, res) {
 *     const ctx = getAppContext<MyContext>();
 *     
 *     // Fully typed access
 *     const user = ctx.get('user'); // type: { id: number; name: string } | undefined
 *     
 *     // Fully typed set
 *     ctx.set('user', { id: 1, name: 'John' });
 * }
 * ```
 */
export function getAppContext<TData extends Record<string, any> = Record<string, any>>(): AppContext<TData> {
    const internal = asyncLocalStorage.getStore();
    
    if (!internal) {
        throw new Error(
            'No context available. Ensure context middleware is registered before accessing context.'
        );
    }
    
    return createContextProxy<TData>(internal);
}

/**
 * Get the current application context, returns undefined if not available
 * Useful for optional context access
 * 
 * @returns {AppContext<TData> | undefined} The current context or undefined
 * 
 * @example
 * ```typescript
 * import { tryGetAppContext } from 'expresspack';
 * 
 * export function someUtility() {
 *     const ctx = tryGetAppContext<MyContext>();
 *     if (ctx) {
 *         const user = ctx.get('user');
 *     }
 * }
 * ```
 */
export function tryGetAppContext<TData extends Record<string, any> = Record<string, any>>(): AppContext<TData> | undefined {
    const internal = asyncLocalStorage.getStore();
    return internal ? createContextProxy<TData>(internal) : undefined;
}

/**
 * Run a function within a context (useful for testing)
 * 
 * @param fn - The function to execute
 * @returns The result of the function
 * 
 * @example
 * ```typescript
 * import { runInContext } from 'expresspack';
 * 
 * interface MyContext {
 *     userId: number;
 * }
 * 
 * const result = runInContext(() => {
 *     const ctx = getAppContext<MyContext>();
 *     ctx.set('userId', 123);
 *     return someFunction();
 * });
 * ```
 */
export function runInContext<T>(fn: () => T): T {
    const internal: InternalContext = {
        data: new Map(),
    };

    return asyncLocalStorage.run(internal, fn);
}