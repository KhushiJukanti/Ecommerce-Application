
const express = require('express');
const PaymentController = require('../controllers/payments');
const router = express.Router();

// POST /payments
router.post('/', PaymentController.createPayment);

// Route to get all payments
router.get('/', PaymentController.getPayments);

// Route to get a single payment by ID
router.get('/:id', PaymentController.getPaymentById);

// Route to update the status of a payment
router.patch('/:id', PaymentController.updatePaymentStatus);

module.exports = router;
