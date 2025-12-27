// analytics.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { stats } from '../controllers/analytics.controller';

const router = Router();
router.get('/stats', requireAuth, requireRole(['admin']), stats);
export default router;
