'use strict';

const passport = require('passport');
const User     = require('../models/user.js');

// Authentications and signups
const performLogin = (req, res, next, user) => {
  req.login(user, (err) => {
    if (err) return next(err);

    // Otherwise, send the user to authenticated page
    return res.redirect('/dashboard');
  });
}

const authController = {
    login: (req, res) => res.render('index'),
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
	},
    processLogin: (req, res, next) => {
        // This is the post handler for login attempts
        var authFunction = passport.authenticate('local', (err, user, info) => {
          if (err) return next(err);
          
          if (!user) {
            console.log('Error logging in!', err);
            return res.redirect('whoops');
          }

          performLogin(req, res, next, user);
        });

        authFunction(req, res, next);
	},
    processSignup: (req, res, next) => {
        // This is the post handler for signups
        let user = new User({
          email: req.body.email,
          password: req.body.password
        });

        user.save((err, user) => {
          if (err) {
            let errorMessage = 'An error occured, please try again';
            
            if (err.code === 11000) {
              errorMessage = 'This user already exists.';
            }

            console.log('Error Signing Up:', errorMessage, err);
            return res.redirect('/auth/login');
          }

          // If we make it this far, we are ready to log the user in.
          performLogin(req, res, next, user);
        });
	}
}

module.exports = authController;