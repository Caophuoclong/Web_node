const express = require('express');
const router = express.Router();
const register_controller = require('../controllers/register');
const login_controller = require('../controllers/login');
const User = require('../models/user');

//@POST /api/auth/register
router.post('/register',register_controller.register);

//@POST /api/auth/login
router.post('/login', register_controller.login);


module.exports = router;