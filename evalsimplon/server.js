// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var bodyParser = require('body-parser'); 	// get body-parser
var logger     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var path 	   	 = require('path');
var config     = require('./config');
var passport   = require('passport');

// [SH] Bring in the data model
require('./app/models/user');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');



// APP CONFIGURATION ==================
// ====================================


// configure our app to handle CORS requests
// app.use(function(req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
// 	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
// 	next();
// });


// log all requests to the console

// connect to our database (hosted on modulus.io)


// ROUTES FOR OUR API =================
// set static files location
mongoose.connect(config.database);
// ====================================

// API ROUTES ------------------------
var routesApi = require('./app_api/routes/index');

var app        = express(); 				// define our app using express

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public/app')));
// [SH] Set the app_client folder to serve static resources
app.use(express.static(path.join(__dirname, '/app_client')));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.use('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

//  Catch unauthorised errors
app.use(function (err, req, res, next){
	if (err.name === 'UnauthorisedError') {
		res.status(401);
		res.json({"message"  :  err.name + ":" + err.message})
	}
});

//   development error handler
//   will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
