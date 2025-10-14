import Emittery from 'emittery';
import { env } from 'node:process'
/**
 * Base event map that users can extend in their applications
 */
export interface EmitterEvents {
    [key: string]: any;
}

function isDebugEnabled(): boolean {
    return env.EXPRESSPACK_EVENT_EMITTER_DEBUG === 'true' 
        || env.EXPRESSPACK_EVENT_EMITTER_DEBUG === '1' 
        || (
            (typeof env.EXPRESSPACK_EVENT_EMITTER_DEBUG === 'boolean') ? 
            env.EXPRESSPACK_EVENT_EMITTER_DEBUG === true : false
        );
}

/**
 * Default emitter instance for convenient access
 */
const emitter = new Emittery<EmitterEvents>({
    debug: {
        name: 'expresspack-emitter',
        enabled: isDebugEnabled()
    }
});

/**
 * Create a new emitter instance (for testing or isolated use)
 */
export function createEmitter<T extends EmitterEvents = EmitterEvents>(): Emittery<T> {
    return new Emittery<T>({
        debug: {
            name: 'c-emitter',
            enabled: isDebugEnabled()
        }
    });
}

export { emitter };
export default emitter;