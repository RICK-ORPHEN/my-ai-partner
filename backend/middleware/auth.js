/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to requests
 */

const { supabase } = require('../lib/supabase');

/**
 * Middleware to verify JWT token from Authorization header
 * Expects: Authorization: Bearer <token>
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header',
      });
    }

    // Extract token
    const token = authHeader.slice(7);

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify authentication',
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token present
 * Useful for routes that work with or without authentication
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, but that's okay
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.slice(7);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Admin-only middleware
 * Verifies user has 'admin' role
 */
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Check user role from users table
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || !user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify admin status',
    });
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  adminMiddleware,
};
