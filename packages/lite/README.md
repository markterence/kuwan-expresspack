# core (kuwan core)

Stripped down version, no auth module, just pure express api + utilities

## Environment Variables

- `NODE_ENV`: Set to `production` to disable type generation for config files.
- `EXPRESSPACK_EVENT_EMITTER_DEBUG`: Set to `true` to enable debug logging for the event emitter.
- `APP_LOG_LEVEL`: Set the log level for the application. Default: `3`.

Log levels:
```
0: Fatal and Error
1: Warnings
2: Normal logs
3: Informational logs, success, fail, ready, start, ...
4: Debug logs
5: Trace logs
-999: Silent
+999: Verbose logs
```