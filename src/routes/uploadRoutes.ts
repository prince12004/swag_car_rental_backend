import { Router } from 'express';
import { upload, uploadImage } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
