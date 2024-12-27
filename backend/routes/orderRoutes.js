const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/rbac');

// Middleware to protect all routes
router.use(authMiddleware);

// Order Listing with RBAC
router.get('/', authorize('view_orders'), orderController.listOrders);

// View Order Details
router.get('/:id', authorize('view_order'), orderController.viewOrder);

// Update Order Details
router.put('/:id', authorize('update_order'), orderController.updateOrder);

// Cancel an Order
router.put('/:id/cancel', authorize('cancel_order'), orderController.cancelOrder);

// Verify an Order
router.put('/:id/verify', authorize('verify_order'), orderController.verifyOrder);

// Add a New Job to an Order
router.post('/:id/jobs', authorize('add_job'), orderController.addJob);

module.exports = router;
