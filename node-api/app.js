var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

otonomoApi = require("./routes/otonomo-api");
mbApi = require("./routes/mb-api");
smartcarApi = require("./routes/smartcar-api");
hmApi = require("./routes/hm-api");

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


/* OTONOMO */
app.use('/otonomo-api', otonomoApi);
app.use('/otonomo-api/personal/oauth', otonomoApi);
app.use('/otonomo-api/personal/check-auth', otonomoApi);
app.use('/otonomo-api/personal/oauth/get-access-token', otonomoApi);
app.use('/otonomo-api/personal/personal-data', otonomoApi);

app.use('/otonomo-api/aggregate/auth', otonomoApi);
app.use('/otonomo-api/aggregate/historical-raw-data', otonomoApi);
app.use('/otonomo-api/aggregate/report-status', otonomoApi);


/* Mercedes-Benz */
app.use('/mb-api', mbApi);
app.use('/mb-api/oauth', mbApi);
app.use('/mb-api/check-auth', mbApi);
app.use('/mb-api/oauth/get-access-token', mbApi);
app.use('/mb-api/oauth/get-access-token/refresh', mbApi);
app.use('/mb-api/connected-vehicle-data', mbApi);
app.use('/mb-api/connected-vehicle-data/vehicles', mbApi);


/* smartcar */
app.use('/smartcar-api', smartcarApi);
app.use('/smartcar-api/oauth', smartcarApi);
app.use('/smartcar-api/oauth/get-access-token', smartcarApi);
//app.use('/smartcar-api/oauth/get-access-token/refresh', smartcarApi);
app.use('/smartcar-api/vehicle-data', smartcarApi);
//app.use('/smartcar-api/oauth/get-access-token', smartcarApi);


/* High Mobility */
app.use('/hm-api', hmApi);
app.use('/hm-api/oauth', hmApi);
app.use('/hm-api/oauth/get-access-token', hmApi);
//app.use('/hm-api/oauth/get-access-token/refresh', hmApi);
app.use('/hm-api/vehicle-data', hmApi);
app.use('/hm-api/car-lock-state', hmApi);
app.use('/hm-api/lock-car', hmApi);
app.use('/hm-api/open-car', hmApi);




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
