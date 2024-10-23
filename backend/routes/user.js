const express = require('express');
const { register, login, getUserRole } = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getUserRole);

module.exports = router;
