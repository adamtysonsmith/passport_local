'use strict';

const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const mongoose      = require('mongoose');
const passport      = require('passport');
const passportLocal = require('./config/passport.js');

const MainController = require('./controllers/main.js');
const AuthController = require('./controllers/auth.js');
const databaseName   = 'passport_local_scaffold';

// Connect to db
mongoose.connect('mongodb://localhost/' + databaseName);

// Express Config
const app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Express Session
app.use(session({
  secret: 'super secret secret string',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Publicly accessible routes
app.get('/', MainController.index);

// Authentication
app.post('/auth/login', AuthController.processLogin);
app.post('/auth/signup', AuthController.processSignup);
app.get('/auth/login', AuthController.login);
app.get('/auth/logout', AuthController.logout);
app.get('/whoops', MainController.whoops)

// Ensure routes below are authenticated
app.use(passportLocal.ensureAuthenticated);
app.get('/dashboard', MainController.dashboard);

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
  console.log(`Express server listening on port: ${port}`);
});