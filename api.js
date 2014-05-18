var mongoose = require('mongoose');
var userSchema = require('./model/user.js');

var User = mongoose.model('User',userSchema.UserSchema);


mongoose.connect('mongodb://geomusique:michael123@oceanic.mongohq.com:10019/app25342036');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected to db");
});

//Exports

exports.login_user = function(req,res){
	var name = req.body.username;
	console.log(name);
	User.findOne({'username':name},function(err,user){
		if(err){
			console.error(err);
		}
		if(!user){
			console.log("Creating user");
			var newUser = new User({username:name,saves:[],trips:[]});
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
	console.log("Saving song: "+req.session.username);
	User.findOne({'username':req.session.username},function(err,user){
		if(err){
			return console.error(err);
		}
		if(!user){
			res("no user");
			return;
		}
		user.saves.push(req.body.save);
		user.save(req.body.song,function(err,song){
			if(err){
				return console.error(err);
			}
			res.json("success");
		});
	});
};

exports.saveTrip = function(req,res){
	User.findOne({'username':req.session.username},function(err,user){
		if(err){
			return console.error(err);
		}
		user.trips.add(req.body.trips);
		user.save();
	});
};

exports.getSongs = function (req,res){
	console.log("getting songs "+req.session.username);
	User.findOne({'username':req.session.username},function(err,user){
		if(err){
			return console.error(err);
		}
		if(!user){
			res.json("no user");
			return;
		}
		console.log(user);
		res.json(user.saves);
	});
};