“”// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var path 	   	 = require('path');
var config     = require('./config');
var passport   = require('passport');

// [SH] Bring in the data model
require('./app_api/models/db');
// [SH] Bring in the Passport config after model is defined
require('/config/passport');



// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


// log all requests to the console

// connect to our database (hosted on modulus.io)

// used for requests that our frontend will make
app.use(morgan('dev'));
app.use(express.static("public"));
app.use('/node_modules',express.static(__dirname + '/node_modules'));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);

// ROUTES FOR OUR API =================
// set static files location
mongoose.connect(config.database);
// ====================================

// API ROUTES ------------------------
//var apiRoutes = require('./app/routes/api')(app, express);
//app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
