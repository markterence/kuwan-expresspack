# Config

## Configuration Loader

The configuration loader is responsible for loading and managing application configurations. It scans the `./config` directory for configuration files.

The files should be named according to the topic they represent, such as `app.ts`, `body-parser.ts`, etc.

## Accessing Configuration

You can access the loaded configuration using the `config` object exported from the `expresspack/config` module. On cases they key is transformed to camelCase, you can use the `getAppConfig` function to retrieve specific configuration values.

```typescript
import config, { getAppConfig } from 'expresspack/config';
const appConfig = config.app; // Access the entire app configuration
const myCustomConfig = getAppConfig('myCustomConfig'); // Access a specific configuration value
```

## Direct Access vs using `getAppConfig`

There is no difference between importing the config files directly or using the `getAppConfig` function. It is a matter of preference. The `getAppConfig` can provide less clutter on the import statements, especially when dealing with multiple configuration files.

## Caveats

### Configuration is mutable

The configuration object is mutable, meaning you can modify its properties at runtime. However, be cautious when doing so, as it may lead to unexpected behavior in your application.

```typescript
import config from 'expresspack/config';

// DO NOT DO THIS
config = null; // This will make the config object null, which can lead to unexpected errors in your application.
```

With that, you can still have an option to modify the configuration properties normally as you would with any other object. However, this will not change the type definitions, so you will not get type safety or autocompletion for the new properties you add.

```typescript
import config from 'expresspack/config';

config.app.someProperty = 'newValue';
config['newthing'] = 'anotherValue';
```

### Accessing Configuration Before Initialization

Configuration is loaded before the application starts, so you cant call `getAppConfig` before the application is initialized. If you need to access configuration values during initialization, consider using the `config` object directly. 

For safety, you can dynamically import the `expresspack/config` module after the `configLoader` has been called, ensuring that the configuration is available.

```typescript
import path from 'node:path';
import express from 'express';
import { 
    gracefulHTTPStart, 
    gracefulShutdown, 
    loadKernel,
    configLoader
 } from 'expresspack';

const app = express();
const port = 3000;

await configLoader(path.join(__dirname));

const server = gracefulHTTPStart(app, port, async () => {
    console.log('Application has started successfully.');

    const config = import('expresspack/config');
    console.log('App Config:', config.app);
});

gracefulShutdown(server, async () => {
    console.log('Application is shutting down gracefully...');
});

export default {
    http: {
        app,
        server
    }
};
````
