'use strict';

module.exports = {
  index: (req, res, next) => res.render('index', {}),
  dashboard: (req, res, next) => res.render('dashboard', {}),
  whoops: (req, res, next) => res.render('whoops', {})
}