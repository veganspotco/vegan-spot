import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
<<<<<<< HEAD
  port: process.env.DB_PORT || 5433,
=======
  port: process.env.DB_PORT || 5432,
>>>>>>> 446188e3 (vea esto coje)
  database: process.env.DB_NAME || 'establishments_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error en el pool de PostgreSQL:', err);
});

<<<<<<< HEAD
export default pool;
=======
export default pool;
>>>>>>> 446188e3 (vea esto coje)
