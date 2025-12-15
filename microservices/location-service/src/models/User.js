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
    static async findById(email) {
        const query = `
            SELECT * FROM users 
            WHERE email = $1 AND is_active = true
            `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }
    static async create(email, password_hash, full_name, role) {
        const query = `
            INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [email, password_hash, full_name, role]);
        return result.rows[0];
    }
}