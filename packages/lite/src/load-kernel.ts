import type { Express } from 'express';
import logger from "./logger";
import type { KernelExports } from './define-kernel';
import { importDefault } from './utils/import-default';

export interface AppBootstrapContext extends Record<string, any> {
    app: Express;
}

export interface LoadKernelOptions {
    /**
     * Loads the main kernel (Express middlewares) of your application.
     *  
     */
    kernel?: () => Promise<any>;
    kernel2?: () => Promise<{ default: (context: AppBootstrapContext) => void | Promise<void> } | ((context: AppBootstrapContext) => void | Promise<void>)>;
    // kernel: () => Promise<KernelExports>;
    /**
     * Loads the event listeners for the application.
     * 
     * @example
     * ```
     * listener: () => import('./app/listeners/index')
     * ```
     */
    listener?: () => Promise<any>;
    /**
     * Optional boot function to run after kernel (middlewares) and listeners are set up (Loaded last).
     * This can be used for any additional initialization logic your application requires.
     * That are not Express middlewares. 
     * 
     * For example, initializing services, setting up database connections, etc.
     * 
     */
    appBootstrap?: (context: AppBootstrapContext) => Promise<void>;
} 

export async function loadKernel({ app }, options: LoadKernelOptions): Promise<void> {
    logger.debug('Loading kernel...');
    const { 
        kernel,
        kernel2,
        listener,
        appBootstrap,
    } = options;
 
    // This is mainly the middleware loading
    // try {
    //     const fn = await kernel();
    //     const setup = fn?.default || fn;
    //     await setup({ app });
    // } catch (error) {
    //     logger.error('Error loading kernel:', error);
    //     throw error;
    // }
    // Upgrade usage of `kernel` to `kernel2`
    let appMiddlewareKernel = kernel2;
    if (kernel && typeof kernel === 'function') {
        // This is for backward compatibility and 
        // to migrate users to the new `kernel2` option.
        // this way we can switch the `kernel2` to be `kernel`.
        appMiddlewareKernel = kernel;
    }
    if (appMiddlewareKernel && typeof appMiddlewareKernel === 'function') {
          try {
            const fn = await appMiddlewareKernel();
            const setup = typeof fn === 'object' && fn !== null && 'default' in fn
                ? fn.default
                : fn;
            if (typeof setup === 'function') {
                await setup({ app });
                logger.debug('Middleware kernel loaded.');
            } else {
                logger.warn('Middleware kernel setup function not found.');
            }
        } catch (error) {
            logger.error('Error loading middleware kernel:', error);
            throw error;
        }
    }

    // Load listeners as part of the kernel
    if (listener && typeof listener === 'function') {
        try {
            // const listenerFn = await listener();
            // const setupListener = listenerFn?.default || listenerFn;
            // if (setupListener === undefined || typeof setupListener !== 'function') {
            //     logger.warn('No listener setup function found');
            // }else {
            //     await setupListener();
            // }
            await importDefault(listener);
        } catch (error) {
            logger.error('Error loading listener:', error);
            throw error;
        }
    }

    // Run the boot function if provided
    if (appBootstrap && typeof appBootstrap === 'function') {
        try {
            await appBootstrap({ app });
        } catch (error) {
            logger.error('Error during boot process:', error);
            throw error;
        }
    }
    
    logger.debug('Kernel loaded.');
 
}