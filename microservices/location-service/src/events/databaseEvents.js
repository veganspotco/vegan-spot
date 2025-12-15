import pool from '../config/database.js';

class DatabaseEventPublisher {
  async publishEstablishmentChange(eventType, establishmentId) {
    try {
      // Obtener datos completos del establecimiento con categorías
      const establishment = await this.getEstablishmentWithCategories(establishmentId);
      
      // Publicar evento via PostgreSQL NOTIFY
      await pool.query(
        `SELECT pg_notify('establishment_changes', $1)`,
        [JSON.stringify({
          event: eventType,
          data: establishment,
          timestamp: new Date().toISOString()
        })]
      );
      console.log(`✅ Evento ${eventType} publicado para: ${establishment.name}`);
    } catch (error) {
      console.warn('No se pudo publicar evento de base de datos:', error.message);
      // Fallback a HTTP
      await this.httpPublishEstablishmentChange(eventType, establishmentId);
    }
  }

  async httpPublishEstablishmentChange(eventType, establishmentId) {
    try {
      const searchServiceUrl = process.env.SEARCH_SERVICE_URL || 'http://localhost:3002';
      const establishment = await this.getEstablishmentWithCategories(establishmentId);
      
      const endpoint = eventType === 'created' 
        ? '/api/internal/establishments' 
        : `/api/internal/establishments/${establishment.id}`;

      const method = eventType === 'created' ? 'POST' : 'PUT';

      const response = await fetch(`${searchServiceUrl}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.adaptToSearchFormat(establishment))
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      console.log(`✅ Evento ${eventType} enviado via HTTP fallback`);
    } catch (error) {
      console.warn('Fallback HTTP también falló:', error.message);
    }
  }

  async getEstablishmentWithCategories(id) {
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
      WHERE e.id = $1
      GROUP BY e.id, u.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  adaptToSearchFormat(establishment) {
    // Mapear perfectamente tu esquema al formato de búsqueda
    return {
      id: establishment.id,
      name: establishment.name,
      description: establishment.description,
      address: establishment.address,
      city: this.extractCityFromAddress(establishment.address),
      type: establishment.type,
      foodTypes: this.mapTypeToFoodTypes(establishment.type),
      price_range: establishment.price_range,
      rating: 0, // Por defecto, puedes añadir un campo de rating después
      opening_hours: establishment.opening_hours,
      latitude: establishment.latitude,
      longitude: establishment.longitude,
      phone: establishment.phone,
      email: establishment.email,
      website: establishment.website,
      categories: establishment.categories || [],
      category_ids: establishment.category_ids || [],
      is_active: establishment.is_active !== false,
      created_by: establishment.created_by,
      created_by_email: establishment.created_by_email,
      created_by_name: establishment.created_by_name
    };
  }

  extractCityFromAddress(address) {
    if (!address) return 'Desconocida';
    
    const addressLower = address.toLowerCase();
    if (addressLower.includes('buga')) return 'Buga';
    if (addressLower.includes('tuluá') || addressLower.includes('tulua')) return 'Tuluá';
    
    // Extraer ciudad usando lógica más inteligente
    const cityMatch = address.match(/(Buga|Tuluá|Tulua|Cali|Bogotá|Medellín)/i);
    return cityMatch ? cityMatch[1] : 'Desconocida';
  }

  mapTypeToFoodTypes(type) {
    // Mapear tu ENUM establishment_type a los foodTypes de búsqueda
    const typeMapping = {
      'vegetarian': ['vegetariano'],
      'vegan': ['vegano'],
      'vegetarian_friendly': ['vegetariano', 'tradicional']
    };
    return typeMapping[type] || ['tradicional'];
  }

}

export default new DatabaseEventPublisher();