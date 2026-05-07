# Middleware

The framework ships built-in middleware modules under the `expresspack/middlewares/*` path. Each module is independently importable so you only pay for what you use. All middleware is also usable in plain Express.js applications.

---

## Body Parser

**Import:** `expresspack/middlewares/body-parser`

Wraps Express's built-in `express.json()` and `express.urlencoded()`. If a `bodyParser` config file exists at `config/body-parser.ts`, the values there take precedence over any options passed inline.

```typescript
import {
    jsonBodyParser,
    urlencodedBodyParser,
    defineConfig,
} from 'expresspack/middlewares/body-parser';
```

### `jsonBodyParser(options?)`

Returns a middleware that parses incoming JSON request bodies.

```typescript
function jsonBodyParser(options?: JSONOptions): Handler
```

### `urlencodedBodyParser(options?)`

Returns a middleware that parses URL-encoded form data.

```typescript
function urlencodedBodyParser(options?: URLEncodedOptions): Handler
```

### `defineConfig(config)`

Helper to define the body-parser configuration object. Use this in `config/body-parser.ts`.

```typescript
function defineConfig(config: BodyParserConfig): BodyParserConfig
```

```typescript
// config/body-parser.ts
import { defineConfig } from 'expresspack/middlewares/body-parser';

export default defineConfig({
    json: { limit: '10mb' },
    urlencoded: { extended: true },
});
```

### Registration

```typescript
// app/kernel.ts
import { defineMiddlewareKernel } from 'expresspack';
import { jsonBodyParser, urlencodedBodyParser } from 'expresspack/middlewares/body-parser';

export default defineMiddlewareKernel(({ app }) => {
    app.use(jsonBodyParser());
    app.use(urlencodedBodyParser());
});
```

---

## Error Handler

**Import:** `expresspack/middlewares/error-handler`

Provides a standardized error-handling middleware and a 404 fallback handler. Works seamlessly with the `CustomError` class exported from `expresspack/error`.

```typescript
import {
    errorHandler,
    notFoundErrorHandler,
} from 'expresspack/middlewares/error-handler';
```

### `errorHandler()`

Returns a 4-argument Express error-handling middleware. Place this **last** in your middleware chain.

- If the error is a `CustomError`, responds with `err.statusCode` and `err.toJSON()`.
- For generic `Error` instances, responds with `500` and `{ error: 'Internal Server Error' }`.

```typescript
function errorHandler(): ErrorRequestHandler
```

### `notFoundErrorHandler()`

Returns a middleware that responds with `404 { error: 'Not Found' }` for any request that reaches it. Place this **after all routes** but **before** `errorHandler`.

```typescript
function notFoundErrorHandler(): RequestHandler
```

### Registration

```typescript
// app/kernel.ts
import { defineMiddlewareKernel } from 'expresspack';
import { errorHandler, notFoundErrorHandler } from 'expresspack/middlewares/error-handler';
import routes from './routes';

export default defineMiddlewareKernel(({ app }) => {
    app.use(routes);
    app.use(notFoundErrorHandler()); // must come after routes
    app.use(errorHandler());          // must be last
});
```

---

## App Context Middleware

**Import:** `expresspack/middlewares/app-context`

Two strategies for attaching per-request context to the request object.

```typescript
import {
    contextStoreMiddleware,
    simpleContextMiddleware,
} from 'expresspack/middlewares/app-context';
```

### `contextStoreMiddleware()`

Uses Node.js `AsyncLocalStorage` to maintain request-scoped context without threading it manually through function arguments. Use `getAppContext()` from `expresspack/context-store` anywhere in the call stack during a request.

```typescript
function contextStoreMiddleware(): RequestHandler
```

> Must be registered as early as possible in the middleware chain — before any code that calls `getAppContext()`.

```typescript
// app/kernel.ts
import { contextStoreMiddleware } from 'expresspack/middlewares/app-context';

export default defineMiddlewareKernel(({ app }) => {
    app.use(contextStoreMiddleware()); // first
    // ...rest of middleware
});
```

### `simpleContextMiddleware()`

A lightweight alternative to `contextStoreMiddleware` for cases where `AsyncLocalStorage` is unavailable or unnecessary. Attaches a `req.appContext` object populated via the `useAppContext` helper.

```typescript
function simpleContextMiddleware(): RequestHandler
```

---

## `CustomError`

**Import:** `expresspack/error`

A structured error class for operational errors. Throw a `CustomError` anywhere in your application and `errorHandler()` will serialize it automatically.

```typescript
import { CustomError } from 'expresspack/error';
```

### Constructor options

| Option | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | `'An error occurred'` | Human-readable error message |
| `code` | `string` | `'INTERNAL_SERVER_ERROR'` | Machine-readable error code |
| `statusCode` | `number` | `500` | HTTP status code |
| `data` | `unknown` | `null` | Additional payload (sanitized for JSON serialization) |
| `isOperational` | `boolean` | `true` | Marks the error as expected/operational |

### Example

```typescript
import { CustomError } from 'expresspack/error';

// In a route handler or service
throw new CustomError({
    message: 'User not found',
    code: 'USER_NOT_FOUND',
    statusCode: 404,
});
```

The `errorHandler()` middleware will respond with:

```json
{
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "statusCode": 404,
    "data": null,
    "isOperational": true
}
```

### `CustomError.isCustomError(error)`

Type guard to check whether a thrown value is a `CustomError`.

```typescript
CustomError.isCustomError(err) // → boolean
```
