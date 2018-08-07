var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressPaginate = require('express-paginate')
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');

var SwaggerUI = require('swagger-ui-express')
var swaggerDocument = require('./static/swagger.json')
var limit = 4
var maxLimit = 10

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Pagination

app.use(logger('dev'));
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use( '/catalog/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument) );


app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use(expressPaginate.middleware(limit, maxLimit))

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
