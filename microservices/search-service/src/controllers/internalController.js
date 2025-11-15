import { Establishment } from '../models/Establishment.js';

export class InternalController {
  // Sincronizar establecimiento (crear o actualizar)
  static async syncEstablishment(req, res) {
    try {
      const establishmentData = req.body;
      
      // Sincronizar establecimiento en la base de datos de búsqueda
      const result = await Establishment.syncFromMainService(establishmentData);
      
      res.json({
        success: true,
        message: 'Establecimiento sincronizado',
        data: result
      });
    } catch (error) {
      console.error('Error sincronizando establecimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar establecimiento específico
  static async updateEstablishment(req, res) {
    try {
      const { id } = req.params;
      const establishmentData = req.body;

      // Asegurarnos de que el ID del cuerpo coincida con el parámetro
      establishmentData.id = id;
      
      const result = await Establishment.syncFromMainService(establishmentData);
      
      res.json({
        success: true,
        message: 'Establecimiento actualizado',
        data: result
      });
    } catch (error) {
      console.error('Error actualizando establecimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar establecimiento (soft delete)
  static async deleteEstablishment(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'UPDATE establishments_search SET is_active = false WHERE id = $1';
      await pool.query(query, [id]);
      
      res.json({
        success: true,
        message: 'Establecimiento marcado como inactivo'
      });
    } catch (error) {
      console.error('Error eliminando establecimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}