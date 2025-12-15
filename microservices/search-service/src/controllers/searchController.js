import { Establishment } from '../models/Establishment.js';


export class SearchController {
  // Búsqueda básica por ciudad
  static async searchByCity(req, res) {
    try {
      const { city, page = 1, limit = 10 } = req.query;
      
      if (!city) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "city" es requerido'
        });
      }

      const offset = (page - 1) * limit;
      const establishments = await Establishment.searchByCity(city, parseInt(limit), offset);
      const total = await Establishment.countByCity(city);

      res.json({
        success: true,
        data: establishments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error en searchByCity:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Búsqueda con filtros avanzados
  static async searchWithFilters(req, res) {
    try {
      const { 
        city, 
        foodTypes, 
        type, 
        minRating, 
        price_range, 
        categories,
        searchText,
        page = 1, 
        limit = 10 
      } = req.query;

<<<<<<< HEAD
      const filters = {
        city,
=======
      // Normaliza valores "todas"/vacíos para no filtrar por ciudad
      const normalizedCity = (city && city.toLowerCase() !== 'todas') ? city : undefined;

      const filters = {
        city: normalizedCity,
>>>>>>> 446188e3 (vea esto coje)
        foodTypes: foodTypes ? foodTypes.split(',') : undefined,
        type: type ? type.split(',') : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        price_range: price_range ? price_range.split(',') : undefined,
        categories: categories ? categories.split(',') : undefined,
        searchText,
        limit: parseInt(limit),
        offset: (page - 1) * limit
      };

      const establishments = await Establishment.searchWithFilters(filters);
      const total = await Establishment.countSearchWithFilters(filters);

      res.json({
        success: true,
        data: establishments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        filters: {
<<<<<<< HEAD
          city,
=======
          city: normalizedCity,
>>>>>>> 446188e3 (vea esto coje)
          foodTypes: filters.foodTypes,
          type: filters.type,
          minRating: filters.minRating,
          price_range: filters.price_range,
          categories: filters.categories,
          searchText
        }
      });
    } catch (error) {
      console.error('Error en searchWithFilters:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Búsqueda por ubicación geográfica
  static async searchByLocation(req, res) {
    try {
      const { lat, lng, radius = 10, limit = 10 } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'Los parámetros "lat" y "lng" son requeridos'
        });
      }

      const establishments = await Establishment.searchByLocation(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: establishments
      });
    } catch (error) {
      console.error('Error en searchByLocation:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener establecimiento por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'SELECT * FROM establishments_search WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Establecimiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 446188e3 (vea esto coje)
