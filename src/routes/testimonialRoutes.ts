import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    getAllTestimonials,
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from '../controllers/testimonialController';

const router = express.Router();

// Public routes
router.get('/', getAllTestimonials);

// Protected routes (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, getAdminTestimonials);
router.post('/', authMiddleware, adminMiddleware, createTestimonial);
router.patch('/:id', authMiddleware, adminMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTestimonial);

export default router;
