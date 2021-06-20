const express = require('express');
const index_router = express.Router();
const index_controller = require('../controllers/index');

index_router.get('/',index_controller.index);

module.exports = index_router;