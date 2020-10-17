var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pageRouter = require('./routes/pages');
var adminPageRouter = require('./routes/admin_page');
var mongoose = require('mongoose');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pages', pageRouter);
app.use('/admin/pages', adminPageRouter);

/*
  /// parse app/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}));
  // parse app/json
  app.use(bodyParser.json());
 */
// catch 404 and forward to error handler







const config = require('./config/config')
mongoose.connect(config.db,    {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection errorrs: '))
db.once('open', function () {
    console.log('we are connected..')
})


// EXPRESS SESSION MIDLEWARE
const session = require('express-session');
app.use(session({
  secret: 'do',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}
}))
/*/
// express validator
const expressValidator = require('express-validator');
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.')
    var root = namespace.shift()
    var  formParam = root;
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      }
  }
}))*/

// Express messages
// set global error v araible
app.locals.errors = null;


app.use(require('connect-flash')());

app.use(function (req, res, next) {
  console.log("locals.messages handler midlewar "  )
  req.flash('success', "hello flash");
  res.locals.messages = require('express-messages')(req, res);
  req.flash('success', "hello flash");
  next();
});


app.use(function(req, res, next) {
  console.log("createError handler midlewar "  )

  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("error handler midlewar "  )
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
