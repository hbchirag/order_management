const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');

// Public Routes (if needed)
// Example: router.get('/public-endpoint', permissionController.publicMethod);

// Secured Routes
router.use(authMiddleware);

router.get('/', permissionController.getAllPermissions);
router.get('/:id', permissionController.getPermissionById);
router.post('/', authorize('create_permission'), permissionController.createPermission);
router.put('/:id', authorize('update_permission'), permissionController.updatePermission);
router.delete('/:id', authorize('delete_permission'), permissionController.deletePermission);

module.exports = router;
