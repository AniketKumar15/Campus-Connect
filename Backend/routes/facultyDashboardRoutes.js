import express from 'express';
import { getFacultyDashboard } from '../controllers/facultyDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/faculty', protect, getFacultyDashboard);

export default router;
