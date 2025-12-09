import 'dotenv/config';
import pool from '../src/config/database.js';
import { Establishment } from '../src/models/Establishment.js';

async function verify() {
    try {
        // Get a user ID
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        if (userRes.rows.length === 0) {
            console.log('No users found. Creating test user might be needed.');
            process.exit(1);
        }
        const userId = userRes.rows[0].id;

        const data = {
            name: 'Test Menu Spot',
            description: 'Testing menu and images',
            address: 'Test Addr',
            city: 'Test City',
            type: 'vegan',
            created_by: userId,
            menu: [{ category: 'Starters', items: [{ name: 'Salad', price: 10 }] }],
            images: ['http://example.com/img1.jpg', 'http://example.com/img2.jpg']
        };

        console.log('Creating establishment...');
        const result = await Establishment.create(data);

        console.log('Created ID:', result.id);
        console.log('Menu:', JSON.stringify(result.menu));
        console.log('Images:', result.images);

        if (result.menu && Array.isArray(result.menu) && result.images && result.images.length === 2) {
            console.log('Verification SUCCESS: Menu and images saved.');
        } else {
            console.log('Verification FAILED: Menu or images missing or incorrect.');
        }

        // Cleanup
        await pool.query('DELETE FROM establishments WHERE id = $1', [result.id]);
        process.exit(0);
    } catch (err) {
        console.error('Verification Error:', err);
        process.exit(1);
    }
}

verify();
