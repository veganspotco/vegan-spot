import pool from '../config/database.js';

export class AuditLog {
  static async create(auditData) {
    const {
      establishment_id,
      user_id,
      action,
      old_values,
      new_values,
      changed_fields,
      ip_address,
      user_agent
    } = auditData;

    const query = `
      INSERT INTO establishment_audit_log 
      (establishment_id, user_id, action, old_values, new_values, changed_fields, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      establishment_id,
      user_id,
      action,
      old_values,
      new_values,
      changed_fields,
      ip_address,
      user_agent
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEstablishmentId(establishmentId) {
    const query = `
      SELECT al.*, u.email as user_email, u.full_name as user_name
      FROM establishment_audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.establishment_id = $1
      ORDER BY al.created_at DESC
    `;
    const result = await pool.query(query, [establishmentId]);
    return result.rows;
  }
  static async findAllAuditLogs() {
    const query = 'SELECT * FROM establishment_audit_log ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}