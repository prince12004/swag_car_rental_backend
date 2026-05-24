import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    createContactQuery,
    getAllQueries,
    getQueryById,
    replyToQuery,
    deleteQuery,
    getQueryStats,
} from '../controllers/contactQueryController';

const router = express.Router();

// Public routes
router.post('/', createContactQuery);

// Protected routes (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllQueries);
router.get('/stats', authMiddleware, adminMiddleware, getQueryStats);
router.get('/:id', authMiddleware, adminMiddleware, getQueryById);
router.put('/:id/reply', authMiddleware, adminMiddleware, replyToQuery);
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuery);

export default router;
