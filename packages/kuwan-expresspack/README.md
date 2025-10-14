
## Features

The goal of this stack is to build an Express.js backend boilerplate with common features required for building applications. This contains optionated libraries and configurations to help you get started quickly but still allows you to use your own libraries if you prefer.

It's just an ExpressJS wrapper at this point so you can pretty much still configure and control everything as you would in a normal Express app.

## Folder Structure
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

---

Things to build and integrate

- [ ] Organized Routing
- [ ] Organized Controller and Service Layer
- Common Middlewares
  - [ ] Body Parser - express
  - [ ] Cookies 
  - [ ] File Upload (Multipart/Form Data) - multer
  - [ ] CORS
- [ ] Environment Variables - dotenv
- [ ] Configuration
- [ ] Error Handling
- [ ] Logging - Pino
- [ ] Database (mysql) - Drizzle
    - [ ] ORM and Query Builder (Models)
    - [ ] Migrations
    - [ ] Seeders
- [ ] Authentication - better-auth
- [ ] Session
- [ ] Authorization
- [ ] JWT
- [ ] Request Validation (Zod)
- [ ] Pub/Sub (bring your own like redis) NodeJS Event Emitters
- [ ] Background Worker - bree
- [ ] Email - nodemailer
- [ ] uWebsockets
- [ ] tRPC? but in non-monorepo setup 🤔
---

### 📚 What does *kuwan* mean?

**“kuwan”**(/kuˈan/ [kuˈwan̪]) is a Filipino (Tagalog) word used when you can’t remember or don’t want to say the actual name of something. It's similar to *“whatchamacallit”* or *“thingamajig”* in English.

> **It’s the whatchamacallit backend**

[Wiktionary: *kuwan*](https://en.wiktionary.org/wiki/kuwan)

-----

