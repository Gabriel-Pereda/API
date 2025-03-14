const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require(path.join(__dirname, '..', 'src', 'middleware', 'auth'));
const { login, logout } = require(path.join(__dirname, '..', 'src', 'controllers', 'authController'));

router.post('/login', login);
router.get('/logout', auth, logout);

module.exports = router;