const express = require('express');
const router = express.Router();
const login_controlelr = require('../controllers/login')

router.get('/',login_controlelr.login);


module.exports = router;
