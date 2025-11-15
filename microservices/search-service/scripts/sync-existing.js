import { Establishment } from '../src/models/Establishment.js';
import { pool } from '../src/config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function syncExisting() {
  try {
    console.log('🔄 Sincronizando establecimientos existentes...');
    
    // Asegurarse de que la tabla existe
    await Establishment.createTable();
    console.log('✅ Tabla de búsqueda verificada');
    
    // Sincronizar todos los establecimientos activos
    const count = await Establishment.initialSyncFromMainDatabase();
    
    console.log(`✅ ${count} establecimientos sincronizados exitosamente!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en sincronización inicial:', error);
    process.exit(1);
  }
}

// Manejar promesas no capturadas
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

syncExisting();