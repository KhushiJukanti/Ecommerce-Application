const Cart = require('../models/cart');

// Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { product, quantity, userId } = req.body;

    // Debugging: Log incoming request data
    console.log('Received request to add item to cart:', { product, quantity, userId });

    // Check if product and quantity are provided
    if (!product || !quantity || !userId) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }

    let cart;


    // Handle logged -in users
    if (userId) {
      // Find or create the user's cart
      cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
    } else {
      // Handle anonymous users (no userId, use session-based cart)
      if (!req.session.cart) {
        req.session.cart = { items: [] }; // Initialize an empty cart in session
      }
      cart = req.session.cart; // Assign the session cart
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product
    );

    if (existingItemIndex > -1) {
      // If the product exists, update the quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the product does not exist, add it to the cart
      cart.items.push({ product, quantity, userId });
    }

    // Save the cart for logged-in users, for anonymous users, it's in the session
    if (userId) {
      await cart.save();
    } else {
      req.session.cart = cart; // Save the cart in the session
    }

    return res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};



exports.getAllCarts = async (req, res) => {
  try {
    // Fetch all carts
    const carts = await Cart.find().populate('items.product');

    if (!carts || !carts.length) {
      return res.status(404).json({ message: 'No carts available' });
    }

    res.status(200).json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ message: 'Failed to fetch carts', error: error.message });
  }
};



  // Remove item from cart
 // controllers/cartController.js
exports.removeCartItem = async (req, res) => {
  const { cartId, itemId } = req.params;
  console.log(`Received cartId: ${cartId}, itemId: ${itemId}`); // Logging for debugging

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      console.log(`Cart with id ${cartId} not found`);
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemExists = cart.items.find(item => item._id.toString() === itemId);
    if (!itemExists) {
      console.log(`Item with id ${itemId} not found in the cart`);
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    console.log(`Item with id ${itemId} removed from cart ${cartId}`);
    res.status(200).json({ message: 'Item removed successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};








