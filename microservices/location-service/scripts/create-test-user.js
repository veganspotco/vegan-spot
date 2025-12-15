import pool from '../src/config/database.js';
import bcrypt from 'bcrypt';

async function createTestUser() {
    try {
        const email = 'admin@veganspot.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            console.log('User already exists. Updating password...');
            const updateQuery = 'UPDATE users SET password_hash = $1 WHERE email = $2';
            await pool.query(updateQuery, [hashedPassword, email]);
            console.log('Password updated.');
        } else {
            console.log('Creating new user...');
            const insertQuery = `
                INSERT INTO users (email, password_hash, full_name, role, is_active)
                VALUES ($1, $2, 'Admin User', 'admin', true)
            `;
            await pool.query(insertQuery, [email, hashedPassword]);
            console.log('User created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestUser();
