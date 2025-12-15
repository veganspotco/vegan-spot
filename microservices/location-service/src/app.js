import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import locationRoutes from './routes/locations.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas requests desde esta IP'
  }
});
app.use(limiter);

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/locations', locationRoutes);



// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Error handler (DEBE ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Microservicio ejecutándose en puerto ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;