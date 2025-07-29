import logger from "./logger";
export async function loadKernel({ app }, { kernel }: { kernel: () => Promise<any> }) {
    logger.debug('Loading kernel...');
    try {
        const fn = await kernel();
        const setup = fn.default || fn;
        await setup({ app });
    } catch (error) {
        logger.error('Error loading kernel:', error);
        throw error;
    }
     
}