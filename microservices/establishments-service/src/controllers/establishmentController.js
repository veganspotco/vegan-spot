
// ¿POR QUÉ usar try/catch en cada método?
// - Manejo explícito de errores
// - Fácil de seguir el flujo
// - Mejor para async/await
import { Establishment } from '../models/Establishment.js';
import { AuditLog } from '../models/AuditLog.js';
import eventPublisher from '../events/databaseEvents.js';

export class EstablishmentController {
  static async create(req, res, next) {
    try {
      const establishment = await Establishment.create(req.body);

      // ✅ PUBLICAR EVENTO AUTOMÁTICAMENTE - EN SEGUNDO PLANO
      eventPublisher.publishEstablishmentChange('created', establishment.id)
        .catch(error => console.error('Error publicando evento:', error));

      res.status(201).json({
        success: true,
        message: 'Establecimiento creado exitosamente',
        data: establishment
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;

      const existing = await Establishment.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Establecimiento no encontrado'
        });
      }

      const updated = await Establishment.update(id, req.body);

      // ✅ PUBLICAR EVENTO AUTOMÁTICAMENTE - EN SEGUNDO PLANO
      eventPublisher.publishEstablishmentChange('updated', id)
        .catch(error => console.error('Error publicando evento:', error));

      res.json({
        success: true,
        message: 'Establecimiento actualizado exitosamente',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const establishment = await Establishment.findById(id);

      if (!establishment) {
        return res.status(404).json({
          success: false,
          message: 'Establecimiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: establishment
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const establishments = await Establishment.findAll(parseInt(limit), offset);

      res.json({
        success: true,
        data: establishments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: establishments.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/establishments/cities - Obtiene las ciudades disponibles

  static async getAvailableCities(req, res, next) {
    try {
      const cities = await Establishment.getAvailableCities();
      res.json({
        success: true,
        data: cities
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/establishments/:id/audit - Historial de modificaciones
  static async getAuditLog(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar que el establecimiento existe
      const establishment = await Establishment.findById(id);
      if (!establishment) {
        return res.status(404).json({
          success: false,
          message: 'Establecimiento no encontrado'
        });
      }

      const auditLogs = await AuditLog.findByEstablishmentId(id);

      res.json({
        success: true,
        data: auditLogs
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const existing = await Establishment.findById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Establecimiento no encontrado'
        });
      }

      await Establishment.delete(id);

      // ✅ PUBLICAR EVENTO AUTOMÁTICAMENTE
      eventPublisher.publishEstablishmentChange('deleted', id)
        .catch(error => console.error('Error publicando evento:', error));

      res.json({
        success: true,
        message: 'Establecimiento eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}