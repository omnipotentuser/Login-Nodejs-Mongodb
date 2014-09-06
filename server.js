var express = require('express');
var session = require('express-session');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var app = express();
var pub = path.join(__dirname, './app/public');
var views = path.join(__dirname, './app/server/views');
var port = process.env.PORT || 20200;

function compile(str, path){
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
};

var env = process.env.NODE_ENV || 'development';

if (env === 'development'){
  console.log('development mode');
  app.use(errorHandler());
  app.use(morgan('dev'));
} else {
  console.log('production mode');
}

// comments
//  testing colorscheme
//
//

app.set('port', port);
app.set('views', views);
app.set('view engine', 'jade');
app.set(favicon());
app.use(bodyParser());
app.use(cookieParser());
app.use(methodOverride());
app.set('trust proxy', 1);
app.use(session({
  secret: 'omnipotent007Securet'
  , resave: true
  , saveUninitialized: true
  , secure: true
  , cookie: { maxAge: 900000 }
}));
app.use(stylus.middleware({
    src: pub
  , compile: compile
}));
app.use(express.static(pub));
require(path.join(__dirname, './app/server/router.js'))(app);

var server = app.listen(port, function(){
  console.log('Express middleware listening on port', app.get('port'));
});
