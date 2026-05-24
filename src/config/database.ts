import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://princekushwahfzd_db_user:8CXhbT5HEvpuPoWc@princecluster.0dtjwgi.mongodb.net/swag_wheels_db';

        await mongoose.connect(mongoUri, {
            retryWrites: true,
            w: 'majority',
        } as any);

        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');
    } catch (error) {
        console.error('❌ MongoDB disconnect error:', error);
    }
};
