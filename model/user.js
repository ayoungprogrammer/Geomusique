var mongoose = require('mongoose');

exports.SaveSchema = new mongoose.Schema({
	location: {'latitude':Number,'longitude':Number},
	song_id:String
});

exports.TripSchema = new mongoose.Schema({
	saves: [exports.SaveSchema]
});

exports.UserSchema = new mongoose.Schema({
	username: String,
	saves: [],
	trips:[exports.TripSchema]
});
