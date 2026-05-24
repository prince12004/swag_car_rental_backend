import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'super_admin';
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'super_admin'],
            default: 'admin',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: Date,
    },
    { timestamps: true }
);

// Hash password before saving
adminSchema.pre<IAdmin>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
adminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
