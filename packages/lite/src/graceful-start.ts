import type { Express } from "express";
import logger from "./logger";
import type { Server } from "node:http";
import emitter from "./services/event";
import { logEnvErrors } from "./env";

export function gracefulHTTPStart(
  app: Express,
  port: number,
  onStart?: () => Promise<void>
): Server {
  const server = app.listen(port, async () => {
    if (onStart) {
      logger.debug("Executing onStart hook...");
      await onStart().catch((err) => {
        logger.error("Error during onStart hook:", err);
      });
    }

    logger.box({
      message: `Server is running at http://localhost:${port}`,
      style: { borderColor: "cyan" },
      level: "info",
    });
    
    try {
      await emitter.emit("app:mounted", { app });
    } catch (err) {
      logger.error("Error during app:mounted event:", err);
    } finally {
      logEnvErrors();
    }
  });

  return server;
}
