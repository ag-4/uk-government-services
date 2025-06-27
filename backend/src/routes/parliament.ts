import express from 'express';
import axios from 'axios';
import { cache } from '../server';

const router = express.Router();

// GET /api/parliament/bills - Get current bills
router.get('/bills', async (req: express.Request, res: express.Response) => {
  try {
    const cacheKey = 'current_bills';
    let bills = cache.get(cacheKey);

    if (!bills) {
      // Mock data - in production, integrate with Parliament API
      bills = [
        {
          id: 'bill001',
          title: 'Digital Rights and Privacy Bill',
          stage: 'Committee Stage',
          description: 'A bill to establish comprehensive digital privacy rights for UK citizens',
          lastUpdated: new Date().toISOString()
        }
      ];
      cache.set(cacheKey, bills, 1800); // Cache for 30 minutes
    }

    res.json({
      success: true,
      data: bills
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bills'
    });
  }
});

export default router;
