const mongoose = require('mongoose');
const Schema = new mongoose.Schema;
// Create schema for user
const infoSchema ={
	fullname:{
		type: String,
		required: true;
	},
	dateofbirth:{
		type: Date,
		required: true;
	},
	address:{
		type: String,
		required: true,
	},
	phonenumber:{
		type: String,
		required: true,
	},
	email{
		type: String,
		required: true,
	},
	account:{
		type: Schema.Types.ObjectID,
		ref : 'users',
	}


};

module.exports = mongoose.model('information', infoSchema);