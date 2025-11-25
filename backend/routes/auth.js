import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { admin } from '../config/firebase-admin.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Helper function to set cookie
const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE || 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};


router.post('/google-login',
    authLimiter,
    async (req, res, next) => {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token is required'
                });
            }

            // Verify Firebase token
            let decodedToken;
            try {
                decodedToken = await admin.auth().verifyIdToken(token);
            } catch (error) {
                console.error('Firebase token verification failed:', error);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            const { email, name, picture, uid } = decodedToken;

            // Check if user exists
            let user = await User.findOne({ email });

            if (user) {
                if (!user.googleId) {
                    user.googleId = uid;
                    await user.save();
                }
            } else {
                // Create new user
                user = await User.create({
                    name: name || 'User',
                    email,
                    googleId: uid,
                });
            }

            // Generate JWT for our backend
            const jwtToken = generateToken(user._id);

            // Set cookie
            setCookie(res, jwtToken);

            res.json({
                success: true,
                message: 'Login successful',
                token: jwtToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    hasPassword: !!user.passwordHash
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/set-password',
    authMiddleware,
    [
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(e => e.msg)
                });
            }

            const { password } = req.body;
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update passwordHash
            // The pre-save hook in User model will hash this because we are modifying 'passwordHash'
            user.passwordHash = password;
            await user.save();

            res.json({
                success: true,
                message: 'Password set successfully'
            });
        } catch (error) {
            next(error);
        }
    }
);


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

router.get('/me', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            hasPassword: !!req.user.passwordHash
        }
    });
});

export default router;
