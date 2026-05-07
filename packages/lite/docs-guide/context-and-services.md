# Context & Services

---

## Request Context

The framework provides two strategies for attaching typed, per-request data to the request lifecycle.

---

### AsyncLocalStorage Context (Recommended)

**Import:** `expresspack/context-store`

Uses Node.js `AsyncLocalStorage` to propagate request context through the entire call stack without passing arguments manually. This is the recommended approach for sharing data like the authenticated user, tenant ID, or request-scoped services.

```typescript
import { getAppContext, tryGetAppContext } from 'expresspack/context-store';
```

#### Setup

Register `contextStoreMiddleware()` as early as possible in your kernel:

```typescript
// app/kernel.ts
import { defineMiddlewareKernel } from 'expresspack';
import { contextStoreMiddleware } from 'expresspack/middlewares/app-context';

export default defineMiddlewareKernel(({ app }) => {
    app.use(contextStoreMiddleware()); // must be first
});
```

#### `getAppContext<TData>()`

Returns the context for the current request. Throws if called outside of a request context.

```typescript
function getAppContext<TData extends Record<string, any>>(): AppContext<TData>
```

#### `tryGetAppContext<TData>()`

Returns the context or `undefined` if called outside a request context. Safe to use in code paths that may run both inside and outside a request.

```typescript
function tryGetAppContext<TData extends Record<string, any>>(): AppContext<TData> | undefined
```

#### `AppContext<TData>` interface

| Method | Description |
|---|---|
| `get(key)` | Get a value by key. Returns `TData[key] \| undefined`. |
| `set(key, value)` | Store a value by key. Fully typed. |
| `has(key)` | Check if a key exists. |
| `delete(key)` | Delete a key. Returns `true` if it existed. |
| `clear()` | Clear all values. |

#### Example

```typescript
// Define your context shape once
interface RequestContext {
    user: { id: number; name: string };
    tenantId: string;
}

// In an auth middleware
import { getAppContext } from 'expresspack/context-store';

app.use((req, res, next) => {
    const ctx = getAppContext<RequestContext>();
    ctx.set('user', { id: 1, name: 'Alice' });
    next();
});

// In a route handler or service — no need to pass req around
export function getUser() {
    const ctx = getAppContext<RequestContext>();
    return ctx.get('user'); // typed as { id: number; name: string } | undefined
}
```

---

### Simple Context

**Import:** `expresspack/simple-context`

A lightweight alternative when `AsyncLocalStorage` is not needed. Attaches context directly to `req.appContext` as a plain object.

```typescript
import { useAppContext } from 'expresspack/simple-context';
```

#### Setup

Register `simpleContextMiddleware()` in your kernel:

```typescript
import { simpleContextMiddleware } from 'expresspack/middlewares/app-context';

app.use(simpleContextMiddleware());
```

#### `useAppContext<TData>(req)`

Returns a `{ get, set }` accessor scoped to the given `req` object.

```typescript
function useAppContext<TData>(req: Request): { get(key): TData[key] | undefined, set(key, value): void }
```

#### TypeScript Augmentation

To get type safety for `req.appContext`, augment the Express `Request` interface in your app:

```typescript
// types/express.d.ts
declare global {
    namespace Express {
        interface Request {
            appContext: {
                user: User;
                session: Session;
            };
        }
    }
}
```

---

## Event Emitter

**Import:** `expresspack/services/event`

A typed event emitter built on [Emittery](https://github.com/sindresorhus/emittery). The default emitter instance is used by the framework internally (e.g., `app:mounted`) and is available for your application to extend.

```typescript
import emitter, {
    createEmitter,
    defineEvents,
    defineEventHandler,
} from 'expresspack/services/event';
```

### Built-in Events

| Event | Payload | When it fires |
|---|---|---|
| `app:mounted` | `{ app: Express }` | After `gracefulHTTPStart` confirms the server is listening |

### Extending the Event Map

Add your own events by augmenting the `EmitterEvents` interface:

```typescript
// app/event_keys.ts
declare module 'expresspack/services/event' {
    interface EmitterEvents {
        'user:created': { userId: number };
        'order:placed': { orderId: string };
    }
}

export const EVENT_SYMBOLS = {
    APP_MOUNTED: 'app:mounted',
    USER_CREATED: 'user:created',
} as const;
```

### Listening to Events

```typescript
import emitter from 'expresspack/services/event';

emitter.on('app:mounted', ({ app }) => {
    console.log('Server is ready.');
});

emitter.on('user:created', ({ userId }) => {
    console.log(`New user: ${userId}`);
});
```

### Emitting Events

```typescript
await emitter.emit('user:created', { userId: 42 });
```

### `defineEvents(setup)`

Organizes event listener registration using a context object:

```typescript
import { defineEvents } from 'expresspack/services/event';

export default defineEvents(({ on, emitter }) => {
    on('app:mounted', ({ app }) => {
        console.log('App mounted');
    });

    on('user:created', ({ userId }) => {
        console.log(`User ${userId} created`);
    });
});
```

Register a listener file in `loadKernel`:

```typescript
await loadKernel({ app }, {
    kernel: () => import('./app/kernel'),
    listener: () => import('./app/listeners/index'), // file that calls defineEvents
});
```

### `defineEventHandler(event, handler)`

Utility for defining a typed handler function for a specific event. Useful when splitting handlers across multiple files.

```typescript
import { defineEventHandler } from 'expresspack/services/event';

export const onUserCreated = defineEventHandler('user:created', ({ userId }) => {
    console.log(`Handling user created: ${userId}`);
});
```

### `createEmitter<T>()`

Creates an isolated emitter instance with the same type-safety. Useful for testing or scoped event buses.

```typescript
import { createEmitter } from 'expresspack/services/event';

const testEmitter = createEmitter();
```

### Debugging

Set the environment variable `EXPRESSPACK_EVENT_EMITTER_DEBUG=true` to enable verbose logging for the emitter.

---

## Logger

**Import:** `expresspack/services/logger`

A console logger built on [Consola](https://github.com/unjs/consola). The log level is controlled by the `APP_LOG_LEVEL` environment variable.

```typescript
import { useConsoleLogger, createConsoleLogger, Logger } from 'expresspack/services/logger';
```

### `useConsoleLogger(name)`

Creates a named logger instance. The name is displayed as a tag in log output.

```typescript
function useConsoleLogger(name: string): ConsolaInstance
```

```typescript
const logger = useConsoleLogger('my-service');
logger.info('Something happened');
logger.error('Something went wrong');
logger.debug('Debug info');
```

`Logger` is an alias for `useConsoleLogger`.

### `createConsoleLogger(name, options)`

Creates a logger with an explicit log level, ignoring `APP_LOG_LEVEL`.

```typescript
function createConsoleLogger(name: string, options: { level?: number }): ConsolaInstance
```

```typescript
const logger = createConsoleLogger('migrations', { level: 4 }); // always debug
```
