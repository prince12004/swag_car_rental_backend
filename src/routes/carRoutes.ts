import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    toggleCarAvailability,
    searchCars,
} from '../controllers/carController';

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/search', searchCars);
router.get('/:id', getCarById);

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, createCar);
router.put('/:id', authMiddleware, adminMiddleware, updateCar);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);
router.patch('/:id/availability', authMiddleware, adminMiddleware, toggleCarAvailability);

export default router;
