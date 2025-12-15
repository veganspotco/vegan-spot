import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

// Pool para la base de datos de búsqueda
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
<<<<<<< HEAD
  port: process.env.DB_PORT || 5433,
=======
  port: process.env.DB_PORT || 5432,
>>>>>>> 446188e3 (vea esto coje)
  database: process.env.SEARCH_DB_NAME || 'establishments_search_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Configurar el listener de eventos PostgreSQL
const setupDatabaseListener = async () => {
  const client = new pg.Client({
    host: process.env.DB_HOST || 'localhost',
<<<<<<< HEAD
    port: process.env.DB_PORT || 5433,
=======
    port: process.env.DB_PORT || 5432,
>>>>>>> 446188e3 (vea esto coje)
    database: process.env.DB_NAME || 'establishments_db', 
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    await client.connect();
    await client.query('LISTEN establishment_changes');
    
    client.on('notification', async (msg) => {
      try {
        const event = JSON.parse(msg.payload);
        console.log('🔔 Evento recibido:', event.event, event.data.name);
        
        // Procesar el evento en segundo plano
        await processEstablishmentEvent(event);
      } catch (error) {
        console.error('❌ Error procesando evento:', error);
      }
    });

    console.log('✅ Escuchando eventos de PostgreSQL para establishment_changes');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL para eventos:', error);
  }
};

const processEstablishmentEvent = async (event) => {
  const { Establishment } = await import('../models/Establishment.js');
  
  try {
    if (event.event === 'created' || event.event === 'updated') {
      await Establishment.syncFromMainService(event.data);
      console.log(`✅ Establecimiento ${event.data.name} sincronizado en búsqueda`);
    }
    // Podemos agregar manejo para 'deleted' después
  } catch (error) {
    console.error('❌ Error sincronizando establecimiento:', error);
  }
};

<<<<<<< HEAD
export { pool, setupDatabaseListener };
=======
export { pool, setupDatabaseListener };
>>>>>>> 446188e3 (vea esto coje)
