import { AuditLog } from '../models/AuditLog.js';
import pool from '../config/database.js';

export const auditMiddleware = (action) => {
  return async (req, res, next) => {
    let oldValues = null;
    
    // OBTENER OLD_VALUES ANTES de que el controller actualice
    if (action === 'update' && req.method === 'PUT') {
      try {
        oldValues = await getEstablishmentById(req.params.id);
  
      } catch (error) {
        console.error('❌ [AUDIT] Error obteniendo old values:', error);
      }
    }
    
    // Guardar referencia original
    const originalJson = res.json;
    
    res.json = function(body) {
      
      // Restaurar inmediatamente
      res.json = originalJson;
      
      // Llamar original
      const result = originalJson.call(this, body);
      
      // Procesar auditoría de forma asíncrona (no bloqueante)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        processAudit(action, req, body, oldValues).catch(err => {
          console.error('❌ Error en auditoría:', err);
        });
      }
      
      return result;
    };

    next();
  };
};

async function processAudit(action, req, responseData, oldValues) {
  try {
   
    if (action === 'update' && req.method === 'PUT' && responseData?.data) {

      // VERIFICAR QUE HAY CAMBIOS REALES
      const changedFields = getChangedFields(oldValues, responseData.data, req.body);
      
      if (changedFields.length === 0) {
        console.log('⚠️ [AUDIT] No hay cambios reales, omitiendo auditoría');
        return;
      }
      
      const auditData = {
        establishment_id: req.params.id,
        user_id: oldValues ? oldValues.created_by : '48bb6b58-45a5-4c62-a9d8-34aedbaf1e47',
        action: 'update',
        old_values: oldValues,
        new_values: responseData.data,
        changed_fields: changedFields,
        ip_address: req.ip || '127.0.0.1',
        user_agent: req.get('User-Agent') || 'Test'
      };
      
      const result = await AuditLog.create(auditData);
      console.log('✅ [AUDIT] Registro creado exitosamente:', result.id);
    }
  } catch (error) {
    console.error('❌ [AUDIT] Error procesando auditoría:', error.message);
  }
}

// Función para detectar campos que realmente cambiaron
function getChangedFields(oldData, newData, requestBody) {
  const changedFields = [];
  
  Object.keys(requestBody).forEach(field => {
    if (oldData && newData) {
      const oldValue = oldData[field];
      const newValue = newData[field];
      
      // Comparar valores (considerando null/undefined)
      if (oldValue !== newValue) {
        changedFields.push(field);
      }
    }
  });
  
  return changedFields;
}

async function getEstablishmentById(id) {
  try {
    const query = 'SELECT * FROM establishments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error obteniendo establecimiento:', error);
    return null;
  }
}