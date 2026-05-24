import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string, expiresIn?: string) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: (expiresIn || process.env.JWT_EXPIRE || '7d') as any }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
        return null;
    }
};
