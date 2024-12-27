const express = require('express');
const userController = require('../controllers/userController');
const authorize = require('../middlewares/rbac'); // Role-based access middleware

const router = express.Router();

// Admin-only routes
router.post('/', authorize('create_user'), userController.createUser);
router.get('/', authorize('view_users'), userController.getAllUsers);
router.get('/:id', authorize('view_user'), userController.getUserById);
router.put('/:id', authorize('update_user'), userController.updateUser);
router.delete('/:id', authorize('delete_user'), userController.deleteUser);

module.exports = router;
