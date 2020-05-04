var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
otonomoApi = require("./routes/otonomo-api");
mbApi = require("./routes/mb-api");

var app = express();
env = require('dotenv').config()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


/* OTONOMO */
app.use('/otonomo-api', otonomoApi);
app.use('/otonomo-api/obtaining-driver-consent', otonomoApi);
app.use('/otonomo-api/obtaining-driver-consent/oauth/redirect', otonomoApi);
app.use('/otonomo-api/personal-data', otonomoApi);

/* Mercedes-Benz */
app.use('/mb-api', mbApi);
app.use('/mb-api/oauth', mbApi);
app.use('/mb-api/check-auth', mbApi);
app.use('/mb-api/oauth/get-access-token', mbApi);
app.use('/mb-api/oauth/get-access-token/refresh', mbApi);
app.use('/mb-api/connected-vehicle-data', mbApi);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
