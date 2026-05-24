import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../models/admin';

const initializeDefaultAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db';

        await mongoose.connect(mongoUri, {
            retryWrites: true,
            w: 'majority',
        } as any);

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@swagwheels.com' });

        if (existingAdmin) {
            console.log('✓ Default admin user already exists');
            console.log(`  Email: ${existingAdmin.email}`);
            console.log(`  Name: ${existingAdmin.name}`);
            console.log(`  Role: ${existingAdmin.role}`);
        } else {
            // Create default admin user
            const defaultAdmin = await Admin.create({
                email: 'admin@swagwheels.com',
                password: 'admin123456',
                name: 'SWAG Wheels Admin',
                role: 'super_admin',
                isActive: true,
            });

            console.log('✅ Default admin user created successfully!');
            console.log(`  Email: ${defaultAdmin.email}`);
            console.log(`  Name: ${defaultAdmin.name}`);
            console.log(`  Role: ${defaultAdmin.role}`);
            console.log('\n⚠️  IMPORTANT: Change this password in production!');
        }

        await mongoose.disconnect();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
        process.exit(1);
    }
};

// Run initialization
initializeDefaultAdmin();
