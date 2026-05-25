import { Response } from 'express';
import multer from 'multer';
import { AuthRequest } from '../middleware/auth';

// Store in memory — convert to base64, no disk or external service needed
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    },
});

export const uploadImage = (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const base64 = req.file.buffer.toString('base64');
    const url = `data:${req.file.mimetype};base64,${base64}`;

    return res.json({ url, filename: req.file.originalname });
};
