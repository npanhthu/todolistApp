var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var mongoose = require('mongoose'); 
var database = require('./config/database'); 
//for pasport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//conect mongodb
mongoose.connect(database.url); 

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
     var userModel = require('./routes/models/userModel');
    
    userModel.findOne({username: username},function(err,userjson){
    	if(err) return console.log(err);
    	if(userjson == null)
    		return done(null, false, { message: 'Incorrect username.' });
    	
    		if(password == userjson.password)
    			return done(null, {name: userjson.username});
        
        return done(null, false, { message: 'Incorrect username.' });
    	
    });
    
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};
//==================================================================

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,saveUninitialized: true,secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize()); // Add passport int
app.use(passport.session());



// routes ======================================================================
app.get('/', routes.index);
require('./routes/routes.js')(app,passport);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});