
const express = require('express');
const { addItemToCart, getAllCarts, removeCartItem } = require('../controllers/cart');
const router = express.Router();

// Add item to cart
router.post('/', addItemToCart);

// Get cart for a user
router.get('/', getAllCarts);

// Remove item from cart
router.delete('/:cartId/items/:itemId', removeCartItem);


module.exports = router;




  
  

