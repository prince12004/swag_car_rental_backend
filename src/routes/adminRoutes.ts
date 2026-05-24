import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    adminRegister,
    adminLogin,
    getAdminProfile,
    updateAdminProfile,
    changePassword,
} from '../controllers/adminController';

const router = express.Router();

// Public routes
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', authMiddleware, getAdminProfile);
router.put('/profile', authMiddleware, updateAdminProfile);
router.put('/change-password', authMiddleware, changePassword);

export default router;
