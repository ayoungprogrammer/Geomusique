
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');

var api = require('./api.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET' }));
app.use(express.methodOverride());
//app.use(app.router);
//





app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 
app.get('/check-auth',function(req,res){
	if(req.session.username){
		console.log("authed");
		res.json("authed");
	}else {
		console.log("not authed");
		res.json("not authed");
	}
});


app.get('/login',function(req,res,next){
	res.sendfile(path.join(__dirname,'public/login.html'));
});

app.get('/',function(req,res,next){
	//res.sendfile('index.html');
	res.sendfile(path.join(__dirname,'public/index.html'));
});


app.post('/login', api.login_user);



app.post('/api/save-song',api.saveSong);
app.get('/api/get-songs',api.getSongs);

app.get('/*',function(req,res){
	res.send("PAGE NOT FOUND");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
