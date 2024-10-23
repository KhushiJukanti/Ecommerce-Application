
const Order = require('../models/orders');

// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, cartItems, totalAmount, paymentId, payment } = req.body;

  try {
    const newOrder = new Order({
      user: userId,
      items: cartItems,
      totalAmount,
      paymentId, // Reference to the payment
      createdAt: Date.now(),
      payment,
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders with populated 'items.product'
exports.getOrders = async (req, res) => {
  const userId = req.query.userId;

    try {
        const orders = await Order.find({ user: userId }).populate('cartItems.product'); // Populate if necessary
        res.json(orders); // This should return the orders array
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

