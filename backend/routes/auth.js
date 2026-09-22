const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getUsers,
  seedEndpoint,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/seed', seedEndpoint);
router.get('/seed', seedEndpoint);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
