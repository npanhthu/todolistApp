var mongoose = require('mongoose');

var todoSchema= new mongoose.Schema({
		username: String,
		password: String,
		email: String
	});
	module.exports = mongoose.model('user',todoSchema);