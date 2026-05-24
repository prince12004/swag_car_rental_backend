import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getBookingStats,
} from '../controllers/bookingController';

const router = express.Router();

// Public routes
router.post('/', createBooking);

// Protected routes (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllBookings);
router.get('/stats', authMiddleware, adminMiddleware, getBookingStats);
router.get('/:id', authMiddleware, adminMiddleware, getBookingById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);
router.put('/:id/cancel', authMiddleware, adminMiddleware, cancelBooking);

export default router;
