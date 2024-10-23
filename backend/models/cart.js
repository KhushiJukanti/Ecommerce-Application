const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
