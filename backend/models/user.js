const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Role can either be 'user' or 'admin'
    default: 'user'          // Default role is 'user'
  }
});


module.exports = mongoose.model('User', userSchema);
