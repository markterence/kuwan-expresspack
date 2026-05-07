# Utilities

Utility modules available from the package. These are general-purpose helpers that can be used independently from the rest of the framework.

---

## Crypto

**Import:** `expresspack/utils/crypto`

Web-standard hashing utilities using the built-in `crypto.subtle` API. Works in Node.js (18+) and edge runtimes.

```typescript
import { sha256, sha1, md5, createHash } from 'expresspack/utils/crypto';
```

### `sha256(data)`

```typescript
const hash = await sha256('hello world');
// → 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576d2c4b3d9b4748bcc'
```

### `sha1(data)`

```typescript
const hash = await sha1('hello world');
```

### `md5(data)`

```typescript
const hash = await md5('hello world');
```

> **Note:** MD5 is available via `crypto.subtle` in some environments but may not be supported everywhere. Prefer `sha256` for security-sensitive use cases.

### `createHash(data, algorithm)`

Low-level function used internally by the other helpers. Pass a custom algorithm object if needed.

```typescript
const hash = await createHash('hello', { name: 'SHA-256', alias: 'sha256' });
```

All functions accept `string | boolean | number | object | ArrayBufferView | ArrayBuffer` as input. Objects are serialized with `JSON.stringify` before hashing.

---

## Dynamic Import

**Import:** `expresspack/utils/dynamic-import`

A utility for lazy-loading handler modules. Useful for event listeners and large handlers that should not be loaded at startup.

```typescript
import { dynamicImport } from 'expresspack/utils/dynamic-import';
```

### `dynamicImport(importer)`

Returns an async function that, when called, dynamically imports the module and immediately invokes its default export with the provided arguments.

```typescript
function dynamicImport<T extends (...args: any[]) => any>(
    importer: () => Promise<{ default: T }>
): T
```

### Example

```typescript
import emitter from 'expresspack/services/event';
import { dynamicImport } from 'expresspack/utils/dynamic-import';

// The welcome user handler is only loaded when the event fires
emitter.on('user:created', dynamicImport(() => import('./handlers/welcome-user')));
```

```typescript
// handlers/welcome-user.ts
export default async function(payload: { userId: number }) {
    await sendWelcomeEmail(payload.userId);
}
```

---

## Third-Party Integrations

### Kysely Logger

**Import:** `expresspack/third-party/kysely-logger`

A Kysely query logger that interpolates parameters into the SQL string for readable log output.

```typescript
import { createKyselyLogger } from 'expresspack/third-party/kysely-logger';
```

#### `createKyselyLogger(options)`

```typescript
function createKyselyLogger(options: KyselyLoggerOptions): (event: LogEvent) => void
```

| Option | Type | Description |
|---|---|---|
| `logger` | `(data: KyselyLoggerParams) => void` | Your logging function |
| `merge` | `boolean` | If `true`, inline parameters into the SQL string |
| `logQueryNode` | `boolean` | If `true`, include the query AST node in output |

#### Example

```typescript
import Kysely from 'kysely';
import { createKyselyLogger } from 'expresspack/third-party/kysely-logger';

const logger = useConsoleLogger('db');

const db = new Kysely({
    // ...dialect config
    log: createKyselyLogger({
        logger: ({ sql, duration, error }) => {
            if (error) {
                logger.error(`Query failed (${duration}ms): ${sql}`, error);
            } else {
                logger.debug(`Query (${duration}ms): ${sql}`);
            }
        },
        merge: true,
        logQueryNode: false,
    }),
});
```

---

### Axios Test Agent

**Import:** `expresspack/third-party/axios-agent`

Creates an Axios instance preconfigured to point at a running test server. Useful for integration tests.

```typescript
import { createAxiosAgent } from 'expresspack/third-party/axios-agent';
```

#### `createAxiosAgent(server)`

```typescript
async function createAxiosAgent(server: http.Server): Promise<{ request: AxiosInstance }>
```

Reads the actual bound port from `server.address()` and sets it as `baseURL`. Uses the `fetch` adapter.

#### Example

```typescript
// test/setup.ts
import { gracefulHTTPStart } from 'expresspack';
import { createAxiosAgent } from 'expresspack/third-party/axios-agent';

const server = gracefulHTTPStart(app, 0); // port 0 = random available port
const { request } = await createAxiosAgent(server);

const res = await request.get('/health');
// res.data → { status: 'ok' }
```
