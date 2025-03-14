const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/auth');
const { login, logout } = require('../src/controllers/authController');

router.post('/login', login);
router.get('/logout', auth, logout);

module.exports = router;