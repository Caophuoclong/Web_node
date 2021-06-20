const mongoose = require('mongoose');
const Schema = new mongoose.Schema;
const chatSchema = {
	text:{
		type: String,
	},
	chatAt:{
		type: Date,
		default: Date.now(),
		required: true,
	},
	owner:{
		type: String,
		required: true,
	},
	inRoom:{
		type: String,
		ref : 'rooms',
	}
}

module.exports = mongoose.model('chats',chatSchema);