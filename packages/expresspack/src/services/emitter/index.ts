import Emittery from 'emittery';

/**
 * Base event map that users can extend in their applications
 */
export interface EmitterEvents {
    [key: string]: any;
}

/**
 * Default emitter instance for convenient access
 */
const emitter = new Emittery<EmitterEvents>({
    debug: {
        name: 'expresspack-emitter',
        enabled: process.env.NODE_ENV === 'development'
    }
});

/**
 * Create a new emitter instance (for testing or isolated use)
 */
export function createEmitter<T extends EmitterEvents = EmitterEvents>(): Emittery<T> {
    return new Emittery<T>({
        debug: {
            name: 'expresspack-emitter',
            enabled: process.env.NODE_ENV === 'development'
        }
    });
}

export { emitter };
export default emitter;