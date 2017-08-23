'use strict';

// external packages
const Hapi = require('hapi');
const Inert = require('inert'); // serve static files
const Vision = require('vision'); // serve views
const Handlebars = require('handlebars');

// local includes
const routes = require('./routes');

// create new hapi server
const server = new Hapi.Server();

// open server connection
server.connection({
  port: process.env.PORT || 3000
});

// configure jwt cookie
server.state('jwt', {
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  isSecure: false,
  isHttpOnly: false,
  encoding: 'base64json',
  clearInvalid: false, // remove invalid cookies
  strictHeader: true // don't allow violations of RFC 6265
});

// register helpers
server.register([Inert, Vision], (err) => {
  if (err) throw err;

  // handlebars templating
  server.views({
    engines: { hbs: Handlebars },
    relativeTo: __dirname,
    path: '../views',
    layoutPath: '../views/layouts',
    layout: 'main'
  });
});

// connect to router
server.route(routes);

// export the server
module.exports = server;
