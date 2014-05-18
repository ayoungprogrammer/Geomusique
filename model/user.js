var mongoose = require('mongoose');
exports.UserSchema = new mongoose.Schema({
	username: String,
	saves: [{location: {'latitude':Number,'longitude':Number},
		date:Date,
		song_id:String}]
});
