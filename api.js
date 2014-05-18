var mongoose = require('mongoose');
var userSchema = require('./model/user.js');

var User = mongoose.model('User',userSchema.UserSchema);


mongoose.connect('mongodb://geomusique:michael123@oceanic.mongohq.com:10019/app25342036');

//Exports
exports.save_song = function (req,res){
	db.saveItem(req.body,function(err){
		res.json(err);
	});
};

exports.login_user = function(req,res){
	var name = req.body.username;
	console.log(name);
	User.findOne({'username':name},function(err,person){
		if(err){
			console.log("Creating user");
			var newUser = new User({username:name,saves:[]});
			newUser.save(function(err,obj){
				if(err)return console.error(err);
				req.session.username = name;
				res.send('sucess');
				//res.redirect('/');
			});
		}
		else {
			console.log("Found user");
			req.session.username = name;
			res.send('sucess');
			//res.redirect('/');
		}
	});
	
	
};

exports.saveSong = function(req,res){
	
	
};

exports.getSongs = function (req,res){
	console.log("getting songs");
	User.findOne({'username':req.session.username},function(err,user){
		if(err){
			return console.error(err);
		}
		return res.json(user.saves);
	});
};