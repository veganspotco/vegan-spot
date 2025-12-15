
// ¿POR QUÉ separar los modelos?
// - Separación de responsabilidades
// - Fácil testing
// - Reutilización de código
import pool from '../config/database.js';

export class Establishment {
  static async create(establishmentData) {
    const {
      name, description, address, city, latitude, longitude,
<<<<<<< HEAD
      phone, email, website, type, price_range, opening_hours, created_by,
      menu, images
    } = establishmentData;

    const query = `
      INSERT INTO establishments 
      (name, description, address, city, latitude, longitude, phone, email, website, type, price_range, opening_hours, created_by, menu, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
=======
      phone, email, website, type, price_range, opening_hours, created_by
    } = establishmentData;

    // Solo insertamos columnas que existen en la tabla (menu/images no existen en el backup actual)
    const query = `
      INSERT INTO establishments 
      (name, description, address, city, latitude, longitude, phone, email, website, type, price_range, opening_hours, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
>>>>>>> 446188e3 (vea esto coje)
      RETURNING *
    `;

    const values = [
      name, description, address, city, latitude, longitude,
<<<<<<< HEAD
      phone, email, website, type, price_range, opening_hours, created_by,
      JSON.stringify(menu || []), images || []
=======
      phone, email, website, type, price_range, opening_hours, created_by
>>>>>>> 446188e3 (vea esto coje)
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, establishmentData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

<<<<<<< HEAD
    Object.keys(establishmentData).forEach(key => {
      if (establishmentData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);

        let value = establishmentData[key];
        // Handle JSONB fields explicitly
        if (key === 'menu') {
          value = JSON.stringify(value);
        }

        values.push(value);
=======
    // Solo permitir columnas que existen en la tabla
    const allowedKeys = new Set([
      'name',
      'description',
      'address',
      'city',
      'latitude',
      'longitude',
      'phone',
      'email',
      'website',
      'type',
      'price_range',
      'opening_hours',
      'is_active'
    ]);

    Object.keys(establishmentData).forEach(key => {
      if (!allowedKeys.has(key)) return; // ignorar campos inexistentes como menu/images
      if (establishmentData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(establishmentData[key]);
>>>>>>> 446188e3 (vea esto coje)
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE establishments 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM establishments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT * FROM establishments 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Obtiene las ciudades disponibles
  static async getAvailableCities() {
    const query = `
      SELECT DISTINCT city 
      FROM establishments 
      WHERE city IS NOT NULL AND is_active = true 
      ORDER BY city
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.city);
  }

  static async delete(id) {
    const query = `
      UPDATE establishments 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 446188e3 (vea esto coje)
