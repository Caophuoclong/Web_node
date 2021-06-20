const express = require('express');
const router = express.Router();
const signup_controller = require('../controllers/signup');

router.get('',signup_controller.index);


module.exports = router;