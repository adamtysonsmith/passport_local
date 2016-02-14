'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// PASSPORT REQUIRES YOU TO USE USERNAME OR ELSE IT WILL NOT WORK
var localStrategy = new LocalStrategy((username, password, done) => {
  // Given a username and password, let's try to authenticate this user.
  User.findOne({email: username}, (err, user) => {
    if (err) return done(err);

    if (!user) return done(null, false);

    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      
      if (isMatch) {
        // Success! Tell passport we made it.
        return done(err, user);
      } else {
        // Password was not correct. Tell passport the login failed.
        return done(null, false);
      }
    });
  });
});

passport.use(localStrategy);

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    // If not, redirect
    res.redirect('/whoops');
  }
}