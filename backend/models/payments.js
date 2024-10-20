const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd', 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending', 
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'other'], 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
