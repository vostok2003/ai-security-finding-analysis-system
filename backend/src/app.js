import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import analysisRoutes from './routes/analysis.routes.js';
import notFoundHandler from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://ai-security-finding-analysis-system.vercel.app',
    ],
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use(limiter);

// Payload parsing Middlewares
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Logging HTTP Requests
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/v1', analysisRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true });
});

// Also bind /health directly for convenience
app.get('/health', (req, res) => {
  res.status(200).json({ success: true });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
