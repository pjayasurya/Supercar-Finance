import { Router, Request, Response } from 'express';
import { db } from '../db/connection.js';
import { logAuditEvent, getClientIp } from '../utils/audit.js';

const router = Router();

/**
 * GET /api/vehicles
 * Get vehicles filtered by price
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { maxPrice, sort = 'price_asc', limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM vehicles WHERE status = $1';
    const params: any[] = ['available'];

    if (maxPrice) {
      query += ` AND price <= $${params.length + 1}`;
      params.push(Number(maxPrice));
    }

    // Sorting
    const sortOptions: any = {
      price_asc: 'ORDER BY price ASC',
      price_desc: 'ORDER BY price DESC',
      year_desc: 'ORDER BY year DESC',
      newest: 'ORDER BY created_at DESC',
    };

    const sortClause = sortOptions[sort as string] || 'ORDER BY price ASC';
    query += ` ${sortClause} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/vehicles/:vehicleId
 * Get single vehicle details
 */
router.get('/:vehicleId', async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const result = await db.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [vehicleId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/vehicles/inventory
 * Get dealer inventory
 */
router.get('/inventory', async (req: Request, res: Response) => {
  try {
    const { dealerId } = req.query;

    let query = 'SELECT * FROM vehicles WHERE status = $1';
    const params: any[] = ['available'];

    if (dealerId) {
      query += ` AND dealer_id = $${params.length + 1}`;
      params.push(dealerId);
    }

    const result = await db.query(query + ' ORDER BY price ASC', params);

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
