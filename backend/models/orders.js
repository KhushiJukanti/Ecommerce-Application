const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Reference to the Payment model
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ['pending', 'completed', 'cancelled'],
  //   default: 'pending',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 
module.exports = mongoose.model('Order', orderSchema);
