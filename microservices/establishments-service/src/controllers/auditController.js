import { AuditLog } from "../models/AuditLog.js";

export class AuditController {
    static async getAuditLogList(req, res, next) {
        try {
            const { limit = 10, page = 1 } = req.query;
            const offset = (page - 1) * limit;
              
            const auditLogs = await AuditLog.findAllAuditLogs(parseInt(limit), offset);
              
            res.json({
            success: true,
            data: auditLogs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                count: auditLogs.length
            }
            });
        } catch (error) {
            next(error);
        }
    }
}