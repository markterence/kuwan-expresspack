# Core API

These functions are exported from the root `expresspack` import.

```typescript
import {
    gracefulHTTPStart,
    gracefulShutdown,
    loadKernel,
    configLoader,
    createRouter,
    defineRouterMiddleware,
    defineMiddlewareKernel,
    defineKernel,
} from 'expresspack';
```

---

## `gracefulHTTPStart`

Starts the Express HTTP server and emits the `app:mounted` event once the server is listening.

```typescript
function gracefulHTTPStart(
    app: Express,
    port: number,
    onStart?: () => Promise<void>
): Server
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `app` | `Express` | The Express application instance |
| `port` | `number` | Port number to listen on |
| `onStart` | `() => Promise<void>` | Optional async hook called after the server starts |

### Returns

A Node.js `http.Server` instance. Pass this to `gracefulShutdown`.

### Example

```typescript
const server = gracefulHTTPStart(app, 3000, async () => {
    console.log('Server is ready');
});
```

---

## `gracefulShutdown`

Registers a `SIGINT` handler that closes the HTTP server cleanly before exiting.

```typescript
function gracefulShutdown(
    server: Server,
    onShutdown: () => Promise<void>
): void
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `server` | `http.Server` | The server returned by `gracefulHTTPStart` |
| `onShutdown` | `() => Promise<void>` | Async hook called after the server closes (close DB connections, etc.) |

### Example

```typescript
gracefulShutdown(server, async () => {
    await db.destroy();
    console.log('Database connection closed.');
});
```

---

## `loadKernel`

Loads the middleware kernel, event listeners, and optional bootstrap function in order.

```typescript
function loadKernel(
    { app }: { app: Express },
    options: LoadKernelOptions
): Promise<void>
```

### `LoadKernelOptions`

| Option | Type | Description |
|---|---|---|
| `kernel` | `() => Promise<any>` | Dynamic import of your middleware kernel file |
| `listener` | `() => Promise<any>` | Dynamic import of your event listener setup file |
| `appBootstrap` | `(context: AppBootstrapContext) => Promise<void>` | Runs last; use for DB connections, service init, etc. |

The `kernel` module must export a default function created with `defineMiddlewareKernel` (or `defineKernel`).

### Example

```typescript
await loadKernel({ app }, {
    kernel: () => import('./app/kernel'),
    listener: () => import('./app/listeners/index'),
    appBootstrap: async ({ app }) => {
        await db.connect();
    },
});
```

---

## `defineMiddlewareKernel`

Defines the global middleware setup function. The function receives `{ app }` and is where you register all `app.use()` calls.

```typescript
function defineMiddlewareKernel(
    setup: (context: { app: Express }) => void | Promise<void>
): typeof setup
```

> `defineKernel` is the older version of this function and is deprecated. Prefer `defineMiddlewareKernel` for new code.

### Example

```typescript
// app/kernel.ts
import { defineMiddlewareKernel } from 'expresspack';
import { jsonBodyParser, urlencodedBodyParser } from 'expresspack/middlewares/body-parser';
import { errorHandler } from 'expresspack/middlewares/error-handler';
import routes from './routes';

export default defineMiddlewareKernel(({ app }) => {
    app.use(jsonBodyParser());
    app.use(urlencodedBodyParser());
    // app.use(routes);
    // Starting v0.1.19, app instance is passed to the router middleware for proper registration
    routes(app); // `routes` is created with `defineRouterMiddleware` and returns a function that accepts the app instance

    app.use(errorHandler());
});
```

---

## `configLoader`

Scans the `config/` directory relative to the given root path, imports every file, and stores the exported values in the global config store. Config files are keyed by their filename converted to camelCase.

```typescript
function configLoader(root: string): Promise<void>
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `root` | `string` | Absolute path to the root of your application (`import.meta.dirname` or `__dirname`) |

### Example

```typescript
await configLoader(import.meta.dirname);
// Loads: config/body-parser.ts → config['bodyParser']
// Loads: config/my-service.ts  → config['myService']
```

> Must be called before `loadKernel` so that config values are available when middleware initializes.

---

## `createRouter`

Creates an Express `Router` instance. A thin wrapper that accepts the same options as Express's `Router()`.

```typescript
function createRouter(options?: RouterOptions): Router
```

### Example

```typescript
import { createRouter } from 'expresspack';

const router = createRouter();

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

export default router;
```

---

## `defineRouterMiddleware`

Creates a router using a callback pattern. Useful for defining the top-level route tree.

```typescript
function defineRouterMiddleware(
    fn: (router: Router) => void,
    options?: RouterOptions
): Router
```

### Example

```typescript
// app/routes.ts
import { defineRouterMiddleware } from 'expresspack';
import userController from './modules/user/api/user_controller';
import healthController from './api/health_controller';

export default defineRouterMiddleware((router) => {
    router.use('/users', userController);
    router.use('/', healthController);
});
```

- Starting v0.1.19, the callback receives an object with `{ app, router }` to allow access to the app instance for proper middleware registration.

```ts
const routerMiddleware = defineRouterMiddleware(({ app, router }) => {
    app.use(controllerRouter);
});
export default routerMiddleware;

// in kernel / defineMiddlewareKernel:
export default defineMiddlewareKernel(({ app }) => {
    routerMiddleware(app);
});
```

---

## Types

### `AppContext`

```typescript
type AppContext = {
    app: Express;
};
```

### `AppBootstrapContext`

```typescript
interface AppBootstrapContext extends Record<string, any> {
    app: Express;
}
```

### `LoadKernelOptions`

```typescript
interface LoadKernelOptions {
    kernel?: () => Promise<any>;
    listener?: () => Promise<any>;
    appBootstrap?: (context: AppBootstrapContext) => Promise<void>;
}
```
