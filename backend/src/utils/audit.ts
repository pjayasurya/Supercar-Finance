import { v4 as uuid } from 'uuid';
import { db } from '../db/connection.js';

export async function logAuditEvent(
  userId: string | null,
  applicationId: string | null,
  action: string,
  details: any,
  ipAddress?: string,
) {
  try {
    await db.query(
      `INSERT INTO audit_logs (user_id, application_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, applicationId, action, JSON.stringify(details), ipAddress],
    );
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

export function getClientIp(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown'
  );
}
