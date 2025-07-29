import type { Express } from 'express';
import logger from './logger'
import type { Server } from 'node:http'; 
import emitter from './services/emitter';

export function gracefulHTTPStart(app: Express, port: number, onStart?: () => Promise<void>): Server {
    const server = app.listen(port, async () => {

        if (onStart) {
            logger.debug('Executing onStart hook...');
            await onStart().catch(err => {
                logger.error('Error during onStart hook:', err);
            }); 
        } 
        logger.box({
            message: `Server is running at http://localhost:${port}`,
            style: { borderColor: 'cyan' },
            level: 'info'
        }) 

        emitter.emit('app:mounted');

    });

    return server;
}