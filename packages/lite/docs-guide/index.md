# expresspack Documentation

`kuwan-expresspack-core` is a lightweight framework layer over Express.js. It provides structured startup, configuration loading, graceful lifecycle management, typed middleware, and request context utilities — while keeping the full Express.js API available at all times.

---

## Contents

| Guide | Description |
|---|---|
| [Getting Started](./getting-started.md) | Installation, minimal example, and application lifecycle |
| [Core API](./core-api.md) | `gracefulHTTPStart`, `loadKernel`, `createRouter`, `defineRouterMiddleware`, and more |
| [Middleware](./middleware.md) | Body parser, error handler, app-context middleware, and `CustomError` |
| [Config & Environment](./config-and-env.md) | Config loader, `getAppConfig`, and environment variable validation with Zod |
| [Context & Services](./context-and-services.md) | AsyncLocalStorage context, simple request context, event emitter, and logger |
| [Utilities](./utilities.md) | Crypto helpers, dynamic imports, Kysely logger, and Axios test agent |

---

## Package Exports

| Import Path | What it provides |
|---|---|
| `expresspack` | Core functions: `gracefulHTTPStart`, `gracefulShutdown`, `loadKernel`, `configLoader`, `createRouter`, `defineRouterMiddleware`, `defineMiddlewareKernel` |
| `expresspack/config` | `config` object and `getAppConfig` accessor |
| `expresspack/error` | `CustomError` class |
| `expresspack/env` | `Env.create`, `getEnvErrorString`, `prettifyEnv` |
| `expresspack/env-config` | Side-effect import to load `.env` files |
| `expresspack/middlewares/body-parser` | `jsonBodyParser`, `urlencodedBodyParser`, `defineConfig` |
| `expresspack/middlewares/error-handler` | `errorHandler`, `notFoundErrorHandler` |
| `expresspack/middlewares/app-context` | `contextStoreMiddleware`, `simpleContextMiddleware` |
| `expresspack/context-store` | `getAppContext`, `tryGetAppContext` |
| `expresspack/simple-context` | `useAppContext` |
| `expresspack/services/event` | `emitter`, `defineEvents`, `defineEventHandler`, `createEmitter` |
| `expresspack/services/logger` | `useConsoleLogger`, `createConsoleLogger`, `Logger` |
| `expresspack/utils/crypto` | `sha256`, `sha1`, `md5`, `createHash` |
| `expresspack/utils/dynamic-import` | `dynamicImport` |
| `expresspack/third-party/kysely-logger` | `createKyselyLogger` |
| `expresspack/third-party/axios-agent` | `createAxiosAgent` |
