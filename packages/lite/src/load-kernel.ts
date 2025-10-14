import type { Express } from 'express';
import logger from "./logger";

export interface AppBootstrapContext extends Record<string, any> {
    app: Express;
}

export interface LoadKernelOptions {
    /**
     * Loads the main kernel (Express middlewares) of your application.
     *  
     */
    kernel: () => Promise<any>;
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

export async function loadKernel({ app }, { 
        kernel,
        listener,
        appBootstrap,
    }: LoadKernelOptions): Promise<void> {
    logger.debug('Loading kernel...');

    // This is mainly the middleware loading
    try {
        const fn = await kernel();
        const setup = fn?.default || fn;
        await setup({ app });
    } catch (error) {
        logger.error('Error loading kernel:', error);
        throw error;
    }

    // Load listeners as part of the kernel
    if (listener && typeof listener === 'function') {
        try {
            const listenerFn = await listener();
            const setupListener = listenerFn?.default || listenerFn;
            if (setupListener === undefined || typeof setupListener !== 'function') {
                logger.warn('No listener setup function found');
            }else {
                await setupListener();
            }
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