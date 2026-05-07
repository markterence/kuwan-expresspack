# Getting Started

`kuwan-expresspack-core` (imported as `expresspack`) is a lightweight framework layer built on top of Express.js. It provides structured startup, config loading, graceful lifecycle management, and typed utilities — while keeping the full Express.js API available at all times.

## Installation

```bash
pnpm add kuwan-expresspack-core express
pnpm add -D @types/express typescript
```

> The package is published as `kuwan-expresspack-core`. Import it using the alias `expresspack` by adding a path alias in your bundler config, or just import from `kuwan-expresspack-core` directly.

---

## Minimal Example

```typescript
// src/app.ts
import path from 'node:path';
import express from 'express';
import {
    gracefulHTTPStart,
    gracefulShutdown,
    loadKernel,
    configLoader,
} from 'expresspack';

const app = express();
const port = Number(process.env.PORT) || 3000;

// 1. Load configuration files from ./config/
await configLoader(path.join(import.meta.dirname));

// 2. Register middleware and routes through the kernel
await loadKernel({ app }, {
    kernel: () => import('./app/kernel'),
});

// 3. Start the server
const server = gracefulHTTPStart(app, port);

// 4. Handle SIGINT for graceful shutdown
gracefulShutdown(server, async () => {
    // close DB connections, flush queues, etc.
});

export default { http: { app, server } };
```

---

## Project Layout

A typical project using expresspack looks like this:

```
src/
├── app.ts                  # Entry point — wires everything together
└── app/
    ├── kernel.ts           # Global Express middleware registration
    ├── routes.ts           # Top-level router
    ├── listeners/          # Event listener setup
    └── modules/
        └── <feature>/
            └── api/
                └── <feature>_controller.ts
config/
    └── body-parser.ts      # Config file, loaded automatically by configLoader
```

---

## Application Lifecycle

```
configLoader()      → loads all files from ./config/
     ↓
loadKernel()        → runs kernel (middleware), listener, then appBootstrap
     ↓
gracefulHTTPStart() → starts HTTP server, emits "app:mounted"
     ↓
gracefulShutdown()  → listens for SIGINT, closes server cleanly
```
