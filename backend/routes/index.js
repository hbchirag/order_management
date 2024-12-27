const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const imapConfigurationRoutes = require('./imapConfigurationRoutes');
const emailRoutes = require('./emailRoutes'); // Added email routes
const orderRoutes = require('./orderRoutes'); // Added email routes


const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Secured routes with authentication
router.use(authMiddleware); // Global middleware for authentication

// Protected routes
router.use('/users', userRoutes); // User routes are protected by authMiddleware
router.use('/roles', roleRoutes); // Role management routes
router.use('/permissions', permissionRoutes); // Permission management routes
router.use('/imap-configurations', imapConfigurationRoutes); // IMAP configuration routes
router.use('/emails', emailRoutes); // Email management routes
router.use('/orders', orderRoutes); // Email management routes


module.exports = router;
