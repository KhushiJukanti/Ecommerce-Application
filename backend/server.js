const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.Mongo_Uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/users', require('./routes/user'));
app.use('/products', require('./routes/product'));
app.use('/payments', require('./routes/payment'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/order'))
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







// const crypto = require('crypto');
// const jwtSecret = crypto.randomBytes(64).toString('hex');
// console.log(jwtSecret);