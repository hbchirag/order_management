const express = require('express');
const router = express.Router();
const imapConfigurationController = require('../controllers/imapConfigurationController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');

// Secured Routes
router.use(authMiddleware);

router.get('/', authorize('view_imap_configurations'), imapConfigurationController.getAllIMAPConfigurations);
router.get('/:id', authorize('view_imap_configuration'), imapConfigurationController.getIMAPConfigurationById);
router.post('/', authorize('create_imap_configuration'), imapConfigurationController.createIMAPConfiguration);
router.put('/:id', authorize('update_imap_configuration'), imapConfigurationController.updateIMAPConfiguration);
router.delete('/:id', authorize('delete_imap_configuration'), imapConfigurationController.deleteIMAPConfiguration);

module.exports = router;
