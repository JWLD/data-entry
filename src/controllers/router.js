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

Router.get('/db-artists', dbController.checkArtist);
Router.post('/db-artists', dbController.addArtist);
Router.post('/db-albums', dbController.addAlbum);

Router.get('/spotify', spotifyController.findAlbum);

module.exports = Router;
