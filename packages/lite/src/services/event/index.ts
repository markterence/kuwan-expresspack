/**
 * @module kuwan-expresspack-core/services/event
 */

import Emittery from "emittery";
import { env } from "node:process";
/**
 * Base event map that users can extend in their applications
 */
export interface EmitterEvents {
  "app:mounted": { app: import("express").Express };
}

function isDebugEnabled(): boolean {
  return (
    env.EXPRESSPACK_EVENT_EMITTER_DEBUG === "true" ||
    env.EXPRESSPACK_EVENT_EMITTER_DEBUG === "1" ||
    (typeof env.EXPRESSPACK_EVENT_EMITTER_DEBUG === "boolean"
      ? env.EXPRESSPACK_EVENT_EMITTER_DEBUG === true
      : false)
  );
}

/**
 * Default emitter instance for convenient access
 */
const emitter = new Emittery<EmitterEvents>({
  debug: {
    name: "expresspack-emitter",
    enabled: isDebugEnabled(),
  },
});

/**
 * Create a new emitter instance (for testing or isolated use)
 */
export function createEmitter<
  T extends EmitterEvents = EmitterEvents
>(): Emittery<T> {
  return new Emittery<T>({
    debug: {
      name: "c-emitter",
      enabled: isDebugEnabled(),
    },
  });
}

export type EventHandler<K extends keyof EmitterEvents> = (
  payload?: EmitterEvents[K]
) => void | Promise<void>;

export type RegisterEventCallback = <K extends keyof EmitterEvents>(
  event: K,
  handler:
    | EventHandler<K>
    | (() => Promise<EventHandler<K>> | Promise<{ default: any }>)
) => void;

export interface DefineEventContext {
  /**
   * Syntactic sugar for registering event listeners
   */
  on: RegisterEventCallback;
  emitter: typeof emitter;
}

export function defineEvents(setup: (context: DefineEventContext) => void) {
  const on: RegisterEventCallback = async (event, handler) => {
    // if (typeof handler === "function" && handler.length === 0) {
    //     if (handler )
    //     emitter.on(event, async(eventData) => {
    //         // const handlerFn = handler as () => Promise<(payload: EmitterEvents[typeof event]) => void | Promise<void>>;
    //         // const mod = await importDefault<EventHandler<typeof event>>(handlerFn);
    //         // return mod(eventData);
    //         const handlerFn = importDefault(handler);
    //         const mod = await dynamicImport<EventHandler<typeof event>>(handlerFn);
    //         return mod(eventData);
    //     } );
    // }
    if (typeof handler === "function" && handler.length === 0) {
      emitter.on(event, async (eventData) => {
        try {
          const fn = await handler();
          const isLazyModule = typeof fn === "object" && fn !== null && "default" in fn;
        
          if (isLazyModule) {
            const mod = fn.default;
            if (typeof mod === "function") {
              return mod(eventData);
            }
          }

          if (typeof fn === "function") {
            return fn(eventData);
          }
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error(`Unknown error occurred in event handler for event "${handler}"`);
            }
        }
      });
    } else {
      console.log(typeof handler);
      emitter.on(event, handler as EventHandler<typeof event>);
    }
  };

  const ctx = {
    on,
    emitter,
  };
  setup(ctx);
}

export function defineEventHandler<K extends keyof EmitterEvents>(
  event: K,
  handler: EventHandler<K> | (() => Promise<EventHandler<K>>)
) {
  return handler;
}

export { emitter };
export default emitter;
export type { Emittery };
