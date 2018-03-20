var express = require('express');
var exphbs  = require('express-handlebars');
var path 	= require('path');
var favicon = require('serve-favicon');
var logger 	= require('morgan');

var bodyParser 	 = require('body-parser');

var index    = require('./routes/index');

var mongoose = require ("mongoose");



var app = express();




app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraperdb", {
 
});

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({type: "application/json"}));

//error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });



app.use('/', index);



module.exports = app;
