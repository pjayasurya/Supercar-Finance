import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db/connection.js';
import { getApplication, updateApplicationStatus } from '../services/applicationService.js';
import { exportToLender, getPreApprovals } from '../services/lenderService.js';
import { logAuditEvent, getClientIp } from '../utils/audit.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/applications
 * Create new application
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = res.locals.userId || 'anon_' + uuid();

    const appResult = await db.query(
      `INSERT INTO applications (
        id, user_id, first_name, last_name, email, phone,
        address, city, state, zip_code, annual_income, employment_status,
        down_payment, desired_loan_amount, loan_term, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        uuid(),
        userId,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        data.annualIncome,
        data.employmentStatus,
        data.downPayment,
        data.desiredLoanAmount,
        data.loanTerm,
        'pending',
      ],
    );

    const applicationId = appResult.rows[0].id;

    res.status(201).json({ id: applicationId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/applications/:applicationId
 * Get application details
 */
router.get('/:applicationId', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const app = await getApplication(applicationId);

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(app);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/applications/:applicationId/export
 * Export application to lender
 */
router.post('/:applicationId/export', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { lenderId } = req.body;

    const result = await exportToLender(applicationId, lenderId);

    await logAuditEvent(
      res.locals.userId,
      applicationId,
      'application_exported',
      { lenderId },
      getClientIp(req),
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/applications/:applicationId
 * Update application
 */
router.put('/:applicationId', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const data = req.body;

    await db.query(
      `UPDATE applications SET
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [
        applicationId,
        data.firstName,
        data.lastName,
        data.email,
        data.phone,
        data.status,
      ],
    );

    await logAuditEvent(
      res.locals.userId,
      applicationId,
      'application_updated',
      data,
      getClientIp(req),
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
