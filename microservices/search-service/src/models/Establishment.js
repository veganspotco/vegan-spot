import pg from 'pg';
const { Pool } = pg;
import { pool } from '../config/database.js';

export class Establishment {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS establishments_search (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        city VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        food_types VARCHAR(100)[],
        price_range VARCHAR(20),
        rating DECIMAL(3,2) DEFAULT 0,
        opening_hours JSONB,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        categories TEXT[],
        category_ids UUID[],
        is_active BOOLEAN DEFAULT true,
        created_by UUID,
        created_by_email VARCHAR(255),
        created_by_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_search_establishments_city ON establishments_search(city);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_food_types ON establishments_search USING GIN(food_types);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_type ON establishments_search(type);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_price_range ON establishments_search(price_range);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_rating ON establishments_search(rating);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_active ON establishments_search(is_active) WHERE is_active = true;
      CREATE INDEX IF NOT EXISTS idx_search_establishments_location ON establishments_search(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_categories ON establishments_search USING GIN(categories);
      CREATE INDEX IF NOT EXISTS idx_search_establishments_name ON establishments_search USING gin(to_tsvector('spanish', name));
      CREATE INDEX IF NOT EXISTS idx_search_establishments_description ON establishments_search USING gin(to_tsvector('spanish', description));
      CREATE INDEX IF NOT EXISTS idx_search_establishments_address ON establishments_search USING gin(to_tsvector('spanish', address));
    `;

    await pool.query(query);
    console.log('✅ Tabla de búsqueda creada/verificada');
  }

  static async syncFromMainService(establishmentData) {
    // Función para extraer ciudad
    const extractCityFromAddress = (address) => {
      if (!address) return 'Desconocida';
      
      const addressLower = address.toLowerCase();
      const cities = [
        { keywords: ['buga'], name: 'Buga' },
        { keywords: ['tuluá', 'tulua'], name: 'Tuluá' }
      ];

      for (const city of cities) {
        if (city.keywords.some(keyword => addressLower.includes(keyword))) {
          return city.name;
        }
      }
      return 'Desconocida';
    };

    // Función para mapear tipos
    const mapTypeToFoodTypes = (type) => {
      const typeMapping = {
        'vegetarian': ['vegetariano'],
        'vegan': ['vegano'],
        'vegetarian_friendly': ['vegetariano', 'tradicional']
      };
      return typeMapping[type] || ['tradicional'];
    };

    const query = `
      INSERT INTO establishments_search 
      (id, name, description, address, city, type, food_types, price_range, 
       rating, opening_hours, latitude, longitude, phone, email, website,
       categories, category_ids, is_active, created_by, created_by_email, created_by_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        type = EXCLUDED.type,
        food_types = EXCLUDED.food_types,
        price_range = EXCLUDED.price_range,
        rating = EXCLUDED.rating,
        opening_hours = EXCLUDED.opening_hours,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        website = EXCLUDED.website,
        categories = EXCLUDED.categories,
        category_ids = EXCLUDED.category_ids,
        is_active = EXCLUDED.is_active,
        created_by_email = EXCLUDED.created_by_email,
        created_by_name = EXCLUDED.created_by_name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      establishmentData.id,
      establishmentData.name,
      establishmentData.description,
      establishmentData.address,
      extractCityFromAddress(establishmentData.address),
      establishmentData.type,
      mapTypeToFoodTypes(establishmentData.type),
      establishmentData.price_range,
      establishmentData.rating || 3.0,
      JSON.stringify(establishmentData.opening_hours || {}),
      establishmentData.latitude,
      establishmentData.longitude,
      establishmentData.phone,
      establishmentData.email,
      establishmentData.website,
      establishmentData.categories || [],
      establishmentData.category_ids || [],
      establishmentData.is_active !== false,
      establishmentData.created_by,
      establishmentData.created_by_email,
      establishmentData.created_by_name
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Resto de los métodos permanecen igual...
  static async searchByCity(city, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM establishments_search 
      WHERE (city ILIKE $1 OR city IS NULL) AND is_active = true 
      ORDER BY rating DESC, name ASC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [`%${city}%`, limit, offset]);
    return result.rows;
  }

  static async countByCity(city) {
    const query = `
      SELECT COUNT(*) FROM establishments_search 
      WHERE (city ILIKE $1 OR city IS NULL) AND is_active = true
    `;
    
    const result = await pool.query(query, [`%${city}%`]);
    return parseInt(result.rows[0].count);
  }

  static async searchWithFilters(filters) {
    let query = `
      SELECT * FROM establishments_search 
      WHERE is_active = true
    `;
    
    const values = [];
    let paramCount = 1;
    const conditions = [];

    if (filters.city) {
      conditions.push(`(city ILIKE $${paramCount} OR city IS NULL)`);
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.foodTypes && filters.foodTypes.length > 0) {
      conditions.push(`food_types && $${paramCount}`);
      values.push(filters.foodTypes);
      paramCount++;
    }

    if (filters.type && filters.type.length > 0) {
      conditions.push(`type = ANY($${paramCount})`);
      values.push(filters.type);
      paramCount++;
    }

    if (filters.minRating) {
      conditions.push(`rating >= $${paramCount}`);
      values.push(parseFloat(filters.minRating));
      paramCount++;
    }

    if (filters.price_range && filters.price_range.length > 0) {
      conditions.push(`price_range = ANY($${paramCount})`);
      values.push(filters.price_range);
      paramCount++;
    }

    if (filters.categories && filters.categories.length > 0) {
      conditions.push(`categories && $${paramCount}`);
      values.push(filters.categories);
      paramCount++;
    }

    if (filters.searchText) {
      conditions.push(`
        (to_tsvector('spanish', name) @@ to_tsquery('spanish', $${paramCount}) OR
         to_tsvector('spanish', description) @@ to_tsquery('spanish', $${paramCount}) OR
         to_tsvector('spanish', address) @@ to_tsquery('spanish', $${paramCount}))
      `);
      values.push(filters.searchText.split(' ').join(' & '));
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY rating DESC, name ASC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(parseInt(filters.limit));
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(parseInt(filters.offset));
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async countSearchWithFilters(filters) {
    let query = 'SELECT COUNT(*) FROM establishments_search WHERE is_active = true';
    const values = [];
    let paramCount = 1;
    const conditions = [];

    if (filters.city) {
      conditions.push(`(city ILIKE $${paramCount} OR city IS NULL)`);
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.foodTypes && filters.foodTypes.length > 0) {
      conditions.push(`food_types && $${paramCount}`);
      values.push(filters.foodTypes);
      paramCount++;
    }

    if (filters.type && filters.type.length > 0) {
      conditions.push(`type = ANY($${paramCount})`);
      values.push(filters.type);
      paramCount++;
    }

    if (filters.minRating) {
      conditions.push(`rating >= $${paramCount}`);
      values.push(parseFloat(filters.minRating));
      paramCount++;
    }

    if (filters.price_range && filters.price_range.length > 0) {
      conditions.push(`price_range = ANY($${paramCount})`);
      values.push(filters.price_range);
      paramCount++;
    }

    if (filters.categories && filters.categories.length > 0) {
      conditions.push(`categories && $${paramCount}`);
      values.push(filters.categories);
      paramCount++;
    }

    if (filters.searchText) {
      conditions.push(`
        (to_tsvector('spanish', name) @@ to_tsquery('spanish', $${paramCount}) OR
         to_tsvector('spanish', description) @@ to_tsquery('spanish', $${paramCount}) OR
         to_tsvector('spanish', address) @@ to_tsquery('spanish', $${paramCount}))
      `);
      values.push(filters.searchText.split(' ').join(' & '));
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  static async searchByLocation(lat, lng, radiusKm = 10, limit = 10) {
    const query = `
      SELECT *,
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance
      FROM establishments_search 
      WHERE is_active = true 
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
      HAVING distance < $3
      ORDER BY distance
      LIMIT $4
    `;
    
    const result = await pool.query(query, [lat, lng, radiusKm, limit]);
    return result.rows;
  }

  static async initialSyncFromMainDatabase() {
    try {
      import('dotenv').then(dotenv => dotenv.config());

      const mainPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        database: process.env.DB_NAME || 'establishments_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
      });

      const query = `
        SELECT 
          e.*,
          u.email as created_by_email,
          u.full_name as created_by_name,
          ARRAY_AGG(DISTINCT ec.name) FILTER (WHERE ec.name IS NOT NULL) as categories,
          ARRAY_AGG(DISTINCT ec.id) FILTER (WHERE ec.id IS NOT NULL) as category_ids
        FROM establishments e
        LEFT JOIN users u ON e.created_by = u.id
        LEFT JOIN establishment_category_relations ecr ON e.id = ecr.establishment_id
        LEFT JOIN establishment_categories ec ON ecr.category_id = ec.id
        WHERE e.is_active = true
        GROUP BY e.id, u.id
      `;

      const result = await mainPool.query(query);
      const establishments = result.rows;

      let synced = 0;
      for (const establishment of establishments) {
        await this.syncFromMainService(establishment);
        synced++;
      }

      await mainPool.end();
      console.log(`✅ Sincronización inicial completada: ${synced} establecimientos`);
      return synced;
    } catch (error) {
      console.error('❌ Error en sincronización inicial:', error);
      throw error;
    }
  }
}