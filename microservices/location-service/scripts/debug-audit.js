import { AuditLog } from '../src/models/AuditLog.js';
 
async function debugAudit() {
  try {
    console.log('🐛 INICIANDO PRUEBA DIRECTA DE AUDITORÍA...');
    
    // 1. Primero verifica que hay establecimientos
    const { default: pool } = await import('../src/config/database.js');
    const establishments = await pool.query('SELECT id FROM establishments LIMIT 1');
    
    if (establishments.rows.length === 0) {
      console.log('❌ No hay establecimientos. Crea uno primero.');
      return;
    }
    
    const establishmentId = establishments.rows[0].id;
    console.log(`🔍 Establecimiento encontrado: ${establishmentId}`);
    
    // 2. Probar crear auditoría directamente
    const testAuditData = {
      establishment_id: establishmentId,
      user_id: '48bb6b58-45a5-4c62-a9d8-34aedbaf1e47',
      action: 'update',
      old_values: { test: 'old value' },
      new_values: { test: 'new value' },
      changed_fields: ['test_field'],
      ip_address: '127.0.0.1',
      user_agent: 'Debug Script'
    };
    
    console.log('📝 Intentando crear registro de auditoría...');
    const result = await AuditLog.create(testAuditData);
    console.log('✅ REGISTRO CREADO EXITOSAMENTE:', result);
    
    // 3. Verificar que se guardó
    const logs = await AuditLog.findByEstablishmentId(establishmentId);
    console.log(`📊 Total de registros de auditoría: ${logs.length}`);
    
    if (logs.length > 0) {
      console.log('📋 Último registro:', logs[0]);
    }
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBA:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit();
  }
}

debugAudit();