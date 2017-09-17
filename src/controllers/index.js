const viewsController = require('./views');
const loginController = require('./login');
const discogsController = require('./discogs');
const dbController = require('./database');

module.exports = [
  viewsController.static,
  viewsController.home,

  loginController.login,
  loginController.redirect,

  discogsController.artists,

  dbController.artists
];
