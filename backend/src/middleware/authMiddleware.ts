import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Memeriksa token login pengguna
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Akses ditolak. Token tidak ditemukan.'
            });
        }

        const token = authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message: 'Konfigurasi JWT_SECRET belum tersedia.'
            });
        }

        const decoded = jwt.verify(token, secret);

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token tidak valid atau sudah kedaluwarsa.'
        });
    }
};