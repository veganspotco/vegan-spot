import 'dotenv/config';
import pool from '../src/config/database.js';


async function addMenuAndImages() {
    try {
        console.log('Adding menu and images columns to establishments table...');

        const query = `
      ALTER TABLE establishments
      ADD COLUMN IF NOT EXISTS menu JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::text[];
    `;

        await pool.query(query);
        console.log('Successfully added menu and images columns.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating database schema:', error);
        process.exit(1);
    }
}

addMenuAndImages();
