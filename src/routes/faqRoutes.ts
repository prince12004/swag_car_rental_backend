import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    getAllFAQs,
    getAdminFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
} from '../controllers/faqController';

const router = express.Router();

// Public routes
router.get('/', getAllFAQs);

// Protected routes (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, getAdminFAQs);
router.post('/', authMiddleware, adminMiddleware, createFAQ);
router.patch('/:id', authMiddleware, adminMiddleware, updateFAQ);
router.delete('/:id', authMiddleware, adminMiddleware, deleteFAQ);

export default router;
