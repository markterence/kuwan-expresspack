# Configuration

## Overview

The framework's config system auto-discovers files in your `config/` directory and makes them available globally via a config store. Config is loaded once at startup — before the kernel runs — and is then available anywhere through the config helpers.

---

## Defining a Config File

Create a file in `config/` named after the topic it covers. The filename is converted to camelCase and used as the key in the config store.

```
config/
├── body-parser.ts    →  config['bodyParser']
├── my-service.ts     →  config['myService']
└── database.ts       →  config['database']
```

Each file should export a default value or a factory function:

```typescript
// config/my-service.ts
export default {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
};
```

Factory functions are also supported:

```typescript
// config/database.ts
export default () => ({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
});
```

---

## Loading Config

Call `configLoader` with the application root before `loadKernel`. This ensures all config values are in place when middleware initializes.

```typescript
import path from 'node:path';
import { configLoader } from 'expresspack';

await configLoader(path.join(import.meta.dirname));
```

---

## Accessing Config

**Import:** `expresspack/config`

```typescript
import config, { getAppConfig } from 'expresspack/config';
```

### `config` object

A plain object keyed by camelCased topic names. Access any loaded config directly:

```typescript
const dbConfig = config.database;
const serviceConfig = config.myService;
```

### `getAppConfig(key)`

Type-safe accessor for a single config value:

```typescript
function getAppConfig<K>(key: string): K
```

```typescript
import { getAppConfig } from 'expresspack/config';

type MyServiceConfig = { baseUrl: string; timeout: number };
const cfg = getAppConfig<MyServiceConfig>('myService');
```

Both approaches are equivalent. `getAppConfig` reduces the number of import statements when pulling config from multiple topics.

---

## Config with Built-in Middleware

Built-in middleware (e.g., body-parser) reads from the config store automatically. Create a matching config file to override the defaults:

```typescript
// config/body-parser.ts
import { defineConfig } from 'expresspack/middlewares/body-parser';

export default defineConfig({
    json: { limit: '5mb' },
    urlencoded: { extended: true },
});
```

When `jsonBodyParser()` is called, it checks `config['bodyParser']` first and uses those options if present.

---

## Caveats

### Config is mutable

The config object is a plain mutable record. Avoid reassigning top-level properties or setting the object to `null` at runtime.

```typescript
// ✅ Fine
config.myService.timeout = 10000;

// ❌ Don't do this
config = null;
```

### Do not read config before `configLoader` completes

Config values are only available after `configLoader` resolves. If you need config values after the server starts, use a dynamic import or access them inside the `onStart` hook:

```typescript
const server = gracefulHTTPStart(app, port, async () => {
    const { default: config } = await import('expresspack/config');
    console.log(config.myService);
});
```

### Bundling

The config loader uses dynamic `import()` at runtime and is not compatible with static bundling. For bundled applications, import your config files directly and pass them to your middleware.

---

## Environment Variables

The following environment variables affect the framework itself:

| Variable | Description |
|---|---|
| `APP_LOG_LEVEL` | Log verbosity level (default: `3`). See log levels below. |
| `NODE_ENV` | Set to `production` to disable development-only features. |
| `EXPRESSPACK_EVENT_EMITTER_DEBUG` | Set to `true` to enable debug logging for the event emitter. |

### Log Levels

| Level | Output |
|---|---|
| `0` | Fatal and Error only |
| `1` | Warnings |
| `2` | Normal logs |
| `3` | Info, success, fail, ready, start (default) |
| `4` | Debug logs |
| `5` | Trace logs |
| `-999` | Silent |
| `+999` | Verbose |

---

## Environment Validation (`Env.create`)

**Import:** `expresspack/env`

The `Env` module integrates [Zod](https://zod.dev) and [`@dotenvx/dotenvx`](https://dotenvx.com) to parse and validate environment variables with full type inference.

```typescript
import { z } from 'zod';
import * as Env from 'expresspack/env';
```

### `Env.create(schema, data, options?)`

Parses `data` (typically `process.env`) against a Zod schema. Returns parsed data with proper TypeScript types, or partial data with `undefined` for missing keys when validation fails (unless `fatal: true`).

```typescript
const env = Env.create(
    z.object({
        PORT: z.coerce.number().default(3000),
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    }),
    process.env,
    { fatal: false, immediate_log_error: true }
);

// env.PORT is typed as number
// env.DATABASE_URL is typed as string
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `fatal` | `boolean` | `false` | Throws an error and stops the app if validation fails |
| `immediate_log_error` | `boolean` | `true` | Logs validation errors immediately when `fatal` is false |
| `log_error_after_graceful_start` | `boolean` | `true` | Logs errors after graceful start via `gracefulHTTPStart` |

### `Env.getEnvErrorString()`

Returns a formatted string describing validation failures, or `null` if validation passed.

```typescript
const errorMessage = Env.getEnvErrorString();
if (errorMessage) console.error(errorMessage);
```

### `Env.getEnvErrorRaw()`

Returns the raw `z.ZodError` instance, or `null` if validation passed.

### `Env.prettifyEnv(env)`

Prints a formatted table of environment variable values to the console. Keys not present in the schema are dimmed and prefixed with `*`. Missing required keys are dimmed and prefixed with `!`.

```typescript
Env.prettifyEnv(env);
```

### Side-effect Import

To load `.env` files automatically (like `dotenv`), add this import at the top of your entry file before reading `process.env`:

```typescript
import 'expresspack/env-config';
```

### Recommended Pattern

```typescript
// src/env.ts
import { z } from 'zod';
import * as Env from 'expresspack/env';

export const env = Env.create(
    z.object({
        PORT: z.coerce.number().default(3000),
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    }),
    process.env,
    { fatal: process.env.NODE_ENV === 'production' }
)!;

export type Env = typeof env;
```

Import `env` from this file wherever you need typed environment variables.
