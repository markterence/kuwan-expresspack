import type { Server } from 'node:http';
import logger from './logger';

export function gracefulShutdown(server: Server, onShutdown: () => Promise<void>): void {
    process.on('SIGINT', async () => {
        logger.info('Received SIGINT. Shutting down gracefully...');
        await new Promise<void>((resolve) => {
            server.close(async (err?: Error) => {
                if (err instanceof Error) {
                    logger.error('Error shutting down server:', err);
                    return resolve();
                }
                if (onShutdown) {
                    await onShutdown().catch(err => {
                        logger.error('Error during shutdown hook:', err);
                    });
                }
                logger.info('Server has been shut down.');
                return resolve();
            });
        });
        process.exit(0);
    });
    // (app as any).down = () => {
    //     return new Promise<void>((resolve) => {
    //         server.close((err?: Error) => {
    //             if (err instanceof Error) {
    //                 console.error('Error shutting down server:', err);
    //                 return resolve();
    //             }
    //             console.info('Server has been shut down.');
    //             if (hooks.onShutdown) {
    //                 hooks.onShutdown().catch(err => {
    //                     console.error('Error during onShutdown hook:', err);
    //                 });
    //             }
    //             return resolve();
    //         });
    //     });
    // };
}