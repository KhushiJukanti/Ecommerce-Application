
const express = require('express');
const { createOrder, getOrders } = require('../controllers/orders');
const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders for a user
router.get('/', getOrders);

module.exports = router;
