const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//  User Register
exports.register = async (req, res) => {
  const { username, password, role, email } = req.body;

  // Validate that username and password are provided
  if (!password || !email) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with the specified role or default to 'user'
    const newUser = new User({ 
      username,
      email, 
      password: hashedPassword,  // Use the hashed password here 
      role: role || 'user' // Default to 'user' if role not provided
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};


//  User Login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate that username and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials - Password does not match' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};


// Get User Role (Requires Authentication)
exports.getUserRole = async (req, res) => {
  try {
    // Find user by ID from the decoded JWT token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's role
    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Server error fetching user role' });
  }
};
