import pool from '../config/database.js';

export class User {

    static async findAll(limit = 10, offset = 0) {
        const query = `
            SELECT * FROM users 
            WHERE is_active = true 
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    }
}