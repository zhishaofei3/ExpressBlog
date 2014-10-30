var express = require('express');
var path = require('path');
var session = require('express-session');
var multer = require('multer');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require("connect-flash");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.bodyParser({uploadDir:'./public/images'}));
app.use(multer({keepExtensions: true, dest: "./public/images"}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: 'keyboard cat'}))
app.use(session({
	secret: settings.cookieSecret,
	resave: false,
	saveUninitialized: false,
	key: settings.db,
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
	store: new MongoStore({
		db: settings.db
	})
}));

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;

