var mongoose = require('mongoose');

var db = require('./mongod.js');

db.init('mongodb://root:password123@oceanic.mongohq.com:10054/app20135974',function(){});

//Exports
exports.save_song = function (req,res){
	db.saveItem(req.body,function(err){
		res.json(err);
	});
};

exports.login_user = function(accessToken, refreshToken, profile, done){
	
	console.log("LOGIN: "+profile);
	
	var found = -1;
	for(var i=0;i<db.users.length;i++){
		if(db.users[i].id == profile.id){
			
			found = i;
		}
	}
	if(found>=0){
		console.log("FOUND: "+profile.id);
		done(null,db.users[found]);
	}else {
		var user= {};
		user.id = profile.id;
	    user.name  = profile.displayName;
	    done(null,user);
	}
	
};

exports.saveSong = function(songId){
	req.username
	
}