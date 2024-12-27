const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');

// Public Routes (if needed)
// Example: router.get('/public-endpoint', roleController.publicMethod);

// Secured Routes
router.use(authMiddleware);

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', authorize('create_role'), roleController.createRole);
router.put('/:id', authorize('update_role'), roleController.updateRole);
router.delete('/:id', authorize('delete_role'), roleController.deleteRole);

// New routes for managing role permissions
router.post('/:id/add-permissions', authMiddleware, authorize('manage_role_permissions'), roleController.addPermissionsToRole);
router.delete('/:id/remove-permissions', authMiddleware, authorize('manage_role_permissions'), roleController.removePermissionsFromRole);
router.post('/create-with-permissions', authMiddleware, authorize('create_role'), roleController.createRoleWithExistingPermissions);



module.exports = router;
