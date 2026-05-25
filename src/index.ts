import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from './config/database';
import adminRoutes from './routes/adminRoutes';
import carRoutes from './routes/carRoutes';
import blogRoutes from './routes/blogRoutes';
import bookingRoutes from './routes/bookingRoutes';
import contactRoutes from './routes/contactRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import faqRoutes from './routes/faqRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app: Express = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://swagcarrental.com',
    'https://www.swagcarrental.com',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: ${origin} not allowed`));
        }
    },
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect to MongoDB
connectDB();

// Root
app.get('/', (_req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: 'SWAG Wheels Car Rental API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            cars: '/api/cars',
            blogs: '/api/blogs',
            bookings: '/api/bookings',
            contact: '/api/contact',
            testimonials: '/api/testimonials',
            faqs: '/api/faqs',
            admin: '/api/admin/login',
        },
    });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'SWAG Wheels API is running' });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response) => {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 API Documentation:`);
    console.log(`  - Admins: POST /api/admin/login`);
    console.log(`  - Cars: GET /api/cars, POST /api/cars (admin)`);
    console.log(`  - Blogs: GET /api/blogs, POST /api/blogs (admin)`);
    console.log(`  - Bookings: POST /api/bookings, GET /api/bookings (admin)`);
    console.log(`  - Contact: POST /api/contact, GET /api/contact (admin)`);
});

export default app;
