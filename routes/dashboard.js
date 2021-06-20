const express = require('express');
const router = express.Router();
const dashboard_controller =require('../controllers/dashboard')
const chat_controller = require('../controllers/chat');


router.get('',dashboard_controller.index);
router.post('/chat',chat_controller.createRoom)
router.get('/:roomname',chat_controller.joinRoom)

module.exports = router;