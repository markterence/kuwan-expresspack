
# Kuwan Backend Stack

Work-in-progress (still under development)

A TypeScript backend stack for building backend applications powered by Express.js.

> _Ano gamit nyong backend?. Ahh... yung kuwan, yung kuwan. ExpressJS, tapos may kuwan, mga kuwan._

## Features

The goal of this stack is to build an Express.js backend boilerplate with common features required for building applications. This contains optionated libraries and configurations to help you get started quickly but still allows you to use your own libraries if you prefer.

It's just an ExpressJS wrapper at this point so you can pretty much still configure and control everything as you would in a normal Express app.

```
your-app/
├── app/
│   ├── middlewares.ts      # Define your middleware stack
│   ├── controllers/        # Route controllers (planned)
│   ├── services/           # Business logic (planned)
│   └── config/
│       ├── body-parser.ts  # Body parser configuration
│       ├── cors.ts         # CORS configuration (planned)
│       └── helmet.ts       # Security headers (planned)
```

#### 💡 **Usage Example**

**Create an app:**
```typescript
import { createApp } from '@markterence/kuwan-expresspack'

const app = await createApp();
```

**Configure body parser:**
```typescript
// app/config/body-parser.ts
import { defineConfig } from '@markterence/kuwan-expresspack/core/body-parser'

export default defineConfig({
  json: {
    limit: '50mb',
    strict: true
  },
  urlencoded: {
    extended: true,
    limit: '50mb'
  }
})
```

**Define middlewares:**
```typescript
// app/middlewares.ts
import { defineMiddlewares, jsonBodyParser, urlencodedBodyParser } from '@markterence/kuwan-expresspack'

export default defineMiddlewares(({ app, router }) => {
    app.use(jsonBodyParser())
    app.use(urlencodedBodyParser())
    
    // Your custom middleware
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })
})
```

#### 🧪 **Testing**
- **Vitest integration** for fast, modern testing
- **Supertest utilities** for HTTP endpoint testing
- **Fixture-based tests** using real app structures