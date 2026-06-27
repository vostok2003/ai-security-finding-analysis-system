import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack || '');
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Connect database and run server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`⚙️ Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`MongoDB connection failed! Server startup aborted: ${err.message}`);
    process.exit(1);
  });
