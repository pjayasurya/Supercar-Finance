import express, { Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { authenticateToken } from './middleware/auth.js';
import creditRoutes from './routes/creditRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import logger from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Authentication
app.use(authenticateToken);

// Routes
app.use('/api/credit', creditRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((error: any, req: Request, res: Response, next: any) => {
  logger.error(`Error: ${error.message}`, { stack: error.stack });
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    status: error.status || 500,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const port = config.port;
app.listen(port, () => {
  logger.info(`✅ Server running on port ${port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

export default app;
