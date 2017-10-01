const Router = require('express').Router();

const viewsController = require('./views');
const loginController = require('./login');
const discogsController = require('./discogs');
const dbController = require('./database');
const spotifyController = require('./spotify');

Router.get('/', viewsController.home);

Router.get('/login', loginController.login);
Router.get('/redirect', loginController.redirect);

Router.get('/discogs-artists', discogsController.artists);
Router.get('/discogs-albums', discogsController.albums);

module.exports = Router;

// module.exports = [
//   loginController.login,
//   loginController.redirect,
//
//   discogsController.artists,
//   discogsController.albums,
//
//   dbController.checkArtist,
//   dbController.addArtist,
//   dbController.addAlbum,
//
//   spotifyController.findAlbum
// ];
