const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');
const { logout } = require("../controllers/authController");


// Public routes
router.post('/login', authController.login);

// Protected routes
router.post('/reset-password', authMiddleware, authController.resetPassword);

router.post("/logout", authMiddleware, logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
