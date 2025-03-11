const express = require('express');
const router = express.Router();
const { login, logout } = require('../src/controllers/authController');
const auth = require('../src/middleware/auth');
const { validateLogin } = require('../src/middleware/validation');

router.post('/login', validateLogin, login);
router.get('/logout', auth, logout);

module.exports = router;