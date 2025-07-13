import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import NodeCache from 'node-cache';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Import routes
import mpsRouter from './routes/mps';
import newsRouter from './routes/news';
import parliamentRouter from './routes/parliament';
import summarizeRouter from './routes/summarize';
import databaseRouter from './routes/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize cache (1 hour default TTL)
export const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://uk-government-services.vercel.app', 'https://your-production-domain.com']
    : true, // Allow all origins in development
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await rateLimiter.consume(clientIp);
    next();
  } catch (rejRes) {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: {
      keys: cache.keys().length,
      stats: cache.getStats()
    }
  });
});

// API Routes
app.use('/api/mps', mpsRouter);
app.use('/api/news', newsRouter);
app.use('/api/parliament', parliamentRouter);
app.use('/api/database', databaseRouter);
app.use('/api/summarize', summarizeRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  cache.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔗 API Base: http://localhost:${port}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📊 Health check: https://uk-government-services.vercel.app/api/health`);
    console.log(`🔗 API Base: https://uk-government-services.vercel.app/api`);
  } else {
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔗 API Base: http://localhost:${port}/api`);
  }
});
