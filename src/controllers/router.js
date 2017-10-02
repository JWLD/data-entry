const Router = require('express').Router();

const viewsController = require('./views');
const discogsController = require('./discogs');
const dbController = require('./database');
const spotifyController = require('./spotify');

Router.get('/', viewsController.home);

Router.get('/login', spotifyController.login);
Router.get('/redirect', spotifyController.redirect);
Router.get('/refresh', spotifyController.refresh);
Router.get('/spotify', spotifyController.findAlbum);

Router.get('/discogs-artists', discogsController.artists);
Router.get('/discogs-albums', discogsController.albums);

Router.get('/db-artists', dbController.checkArtist);
Router.post('/db-artists', dbController.addArtist);
Router.post('/db-albums', dbController.addAlbum);

module.exports = Router;
