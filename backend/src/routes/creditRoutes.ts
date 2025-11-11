import { Router, Request, Response } from 'express';
import { applicationSchema } from '../schemas/application.js';
import { createApplication, updateApplicationStatus } from '../services/applicationService.js';
import { softPullCredit, validateApplicationEligibility } from '../services/creditService.js';
import { matchLenders, savePreApprovals, getPreApprovals } from '../services/lenderService.js';
import { logAuditEvent, getClientIp } from '../utils/audit.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/credit/apply
 * Submit soft-pull credit application
 */
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const data = applicationSchema.parse(req.body);

    // Get or create user
    let userId = res.locals.userId;
    if (!userId) {
      // Create temporary user for anonymous applications
      userId = 'anon_' + Date.now();
    }

    // Create application
    const applicationId = await createApplication(userId, data);

    // Perform soft-pull credit check
    const creditData = await softPullCredit(data.ssn, data.dob);

    // Validate eligibility
    const eligible = await validateApplicationEligibility(data, creditData);

    if (!eligible) {
      await updateApplicationStatus(applicationId, 'declined', creditData);
      await logAuditEvent(userId, applicationId, 'application_declined', { reason: 'Eligibility check failed' }, getClientIp(req));
      
      return res.status(200).json({
        id: applicationId,
        status: 'declined',
        message: 'Unfortunately, you do not meet our current eligibility criteria.',
      });
    }

    // Match with lenders
    const approvals = await matchLenders(data, creditData);

    // Save pre-approvals
    await savePreApprovals(applicationId, approvals);

    // Update application status
    await updateApplicationStatus(applicationId, 'approved', creditData);

    // Log event
    await logAuditEvent(userId, applicationId, 'application_submitted', { creditScore: creditData.ficoScore }, getClientIp(req));

    res.status(201).json({
      id: applicationId,
      status: 'approved',
      ficoScore: creditData.ficoScore,
      creditFactors: creditData.factors,
      preApprovalsCount: approvals.length,
    });
  } catch (error: any) {
    console.error('Application submission error:', error);
    res.status(400).json({
      error: error.message || 'Application submission failed',
    });
  }
});

/**
 * GET /api/credit/pre-approvals/:applicationId
 * Get pre-approval results
 */
router.get('/pre-approvals/:applicationId', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const approvals = await getPreApprovals(applicationId);

    res.json({
      approvals,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/credit/analysis/:applicationId
 * Get credit analysis results
 */
router.get('/analysis/:applicationId', async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    
    // TODO: Fetch from database
    res.json({
      ficoScore: 720,
      factors: [
        'Payment history (35%)',
        'Credit utilization (30%)',
        'Length of credit history (15%)',
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
