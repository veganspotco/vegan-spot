import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { pool, setupDatabaseListener } from './config/database.js';
import searchRoutes from './routes/searchRoutes.js';
import internalRoutes from './routes/internalRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import establishmentRoutes from './routes/establishmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/establishments', searchRoutes);
app.use('/api/internal', internalRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/list', establishmentRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      service: 'Search Service',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      service: 'Search Service',
      error: error.message 
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar la base de datos y el listener de eventos
async function initializeService() {
  try {
    // Crear tabla si no existe
    const { Establishment } = await import('./models/Establishment.js');
    await Establishment.createTable();
    console.log('✅ Tabla de búsqueda verificada/creada');

    // Iniciar listener de eventos de PostgreSQL
    await setupDatabaseListener();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Search Service ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error inicializando el servicio:', error);
    process.exit(1);
  }
}

initializeService();

export default app;