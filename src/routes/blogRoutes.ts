import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    likeBlog,
} from '../controllers/blogController';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.post('/:id/like', likeBlog);

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, createBlog);
router.put('/:id', authMiddleware, adminMiddleware, updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);
router.patch('/:id/publish', authMiddleware, adminMiddleware, publishBlog);

export default router;
