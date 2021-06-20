const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const roomSchema = {
	hostname:{
		type: String,
		required: true,
	},
	roomname:{
		type: String,
		required: true,
	},
	member: {
		type: Array,
	},
}

module.exports = mongoose.model('rooms',roomSchema);