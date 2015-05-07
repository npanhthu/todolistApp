var mongoose = require('mongoose');

var todoSchema= new mongoose.Schema({
		username: String,
		task: String,
		dateinfo: {
			CreateTime: {type: Date, default: Date.now},
			CompleteTime: Date
		},
		completed: {type: Boolean, default: false}
	});
	module.exports = mongoose.model('tasks',todoSchema);