const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');

// Secured Routes
router.use(authMiddleware);

// Email Listing
router.get('/', authorize('view_emails'), emailController.listEmails);

// View Email Details
router.get('/:id', authorize('view_email'), emailController.viewEmail);

// Reclassify Email
router.put('/:id/reclassify', authorize('reclassify_email'), emailController.reclassifyEmail);

// Delete Email
router.delete('/:id', authorize('delete_email'), emailController.deleteEmail);

// Manual Sync Emails
router.post('/sync', authorize('sync_emails'), emailController.syncEmails);

module.exports = router;
