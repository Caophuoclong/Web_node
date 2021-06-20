const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const userSchema = {
	name: {
		type: String,
		required: true,
	},
	username:{
		type: String,
		required: true,
		unique: true,
		lowcase: true
	},
	password:{
		type: String,
		required: true,
	},
	admin:{
		type:Boolean,
		default: false,
	},
	salt:{
		type: String,
		required: true,
	},
	createAt:{
		type: Date,
		default: Date.now(),
	},
	
}

module.exports = mongoose.model('users',userSchema);