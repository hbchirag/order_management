const jwt = require('jsonwebtoken');
const { User, TokenBlacklist } = require('../models');

const authMiddleware = async (req, res, next) => {
  console.log('AuthMiddleware Loaded');

  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Authorization denied.' });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
    if (blacklistedToken) {
      return res.status(403).json({ message: 'Token is invalidated. Please log in again.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check user status
    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'User account is inactive or suspended.' });
    }

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    console.error('AuthMiddleware Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
