const viewsController = require('./views');
const loginController = require('./login');
const discogsController = require('./discogs');

module.exports = [
  require('./static'),
  viewsController.home,
  loginController.login,
  loginController.redirect,
  discogsController.artists
];
