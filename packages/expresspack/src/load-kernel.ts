import logger from "./logger";
export async function loadKernel({ app }, { 
        kernel,
        listener,
    }: { 
        kernel: () => Promise<any> 
        listener?: () => Promise<any>
    }) {
    logger.debug('Loading kernel...');

    // This is mainly the middleware loading
    try {
        const fn = await kernel();
        const setup = fn.default || fn;
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
     
}