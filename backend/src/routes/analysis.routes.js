import { Router } from 'express';
import {
  analyzeSecurityFinding,
  getAnalysisHistory,
  deleteAnalysisHistory,
} from '../controllers/analysis.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createAnalysisValidator } from '../validators/analysis.validator.js';

const router = Router();

// POST /api/v1/analyze
router.post('/analyze', validate(createAnalysisValidator), analyzeSecurityFinding);

// GET /api/v1/history
router.get('/history', getAnalysisHistory);

// DELETE /api/v1/history/:id
router.delete('/history/:id', deleteAnalysisHistory);

export default router;
