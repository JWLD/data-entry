const viewsController = require('./views');
const loginController = require('./login');
const discogsController = require('./discogs');
const dbController = require('./database');
const spotifyController = require('./spotify');

module.exports = [
  viewsController.static,
  viewsController.home,

  loginController.login,
  loginController.redirect,

  discogsController.artists,
  discogsController.albums,

  dbController.checkArtist,
  dbController.addArtist,

  spotifyController.findAlbum
];
