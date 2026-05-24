import { Response } from 'express';
import { Admin } from '../models/admin';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const adminRegister = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if any admin already exists (allow only one admin)
        const adminExists = await Admin.findOne({});
        if (adminExists) {
            return res.status(403).json({
                message: 'An admin already exists. Only one admin is allowed. Please login with existing credentials.'
            });
        }

        const admin = await Admin.create({
            email,
            password,
            name,
            role: 'admin',
        });

        const token = generateToken(admin._id.toString(), admin.role);

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const adminLogin = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const token = generateToken(admin._id.toString(), admin.role);

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAdminProfile = async (req: AuthRequest, res: Response) => {
    try {
        const admin = await Admin.findById(req.userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.userId,
            { name, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            admin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.userId).select('+password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await admin.comparePassword(oldPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            message: 'Password changed successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
