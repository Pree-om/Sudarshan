const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Production-grade authentication
class AuthService {
    static generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, plan: user.plan },
            process.env.JWT_SECRET,
            { expiresIn: '24h', issuer: 'sudrashan.com' }
        );
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 12);
    }

    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}

// Rate limiting middleware
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many authentication attempts' },
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per window
    message: { error: 'Rate limit exceeded' }
});

module.exports = { AuthService, authLimiter, apiLimiter };