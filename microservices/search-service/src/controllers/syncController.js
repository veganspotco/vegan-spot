import { Establishment } from '../models/Establishment.js';

export class SyncController {
  static async syncAll(req, res) {
    try {
      console.log('🔄 Iniciando sincronización manual...');
      
      const count = await Establishment.initialSyncFromMainDatabase();
      
      res.json({
        success: true,
        message: `Sincronización completada. ${count} establecimientos sincronizados.`,
        count
      });
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      res.status(500).json({
        success: false,
        message: 'Error en sincronización',
        error: error.message
      });
    }
  }
}