const express = require('express');
const user_router = express.Router();
const user_controller = require('../controllers/user')

user_router.get('/', user_controller.index);
user_router.get('/:id',(req,res)=>{
	res.send(`You are in ${req.params.id}`);
})

module.exports = user_router;