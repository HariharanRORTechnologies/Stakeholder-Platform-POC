import { initializeDatabase, closeDatabase } from './database/connection.js';
import { createApp } from './app.js';
import { envConfig } from './config/env.config.js';
import { logger } from './utils/logger.js';

async function startServer() {
  try {
    logger.info('Starting Stakeholder Platform API Server');
    logger.info(`Environment: ${envConfig.NODE_ENV}`);

    const db = await initializeDatabase();
    const app = createApp(db);

    const server = app.listen(envConfig.PORT, envConfig.HOST, () => {
      logger.info(`Server running at http://${envConfig.HOST}:${envConfig.PORT}`);
      logger.info(`API available at http://${envConfig.HOST}:${envConfig.PORT}/api/${envConfig.API_VERSION}`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      server.close(async () => {
        await closeDatabase();
        logger.info('Server shut down complete');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Shutdown timeout, forcing exit');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', error => {
      logger.error('Uncaught Exception', { error });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();
