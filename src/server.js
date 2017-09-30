// external packages
const Hapi = require('hapi');
const Inert = require('inert'); // serve static files
const Vision = require('vision'); // serve views
const Handlebars = require('handlebars');
const Path = require('path');

// local includes
const routes = require('./controllers');

// create new hapi server
const server = new Hapi.Server();

// open server connection
server.connection({
  port: process.env.PORT || 3000
});

// configure cookies
server.state('jwt', {
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  isSecure: false,
  isHttpOnly: false
});

server.state('user', {
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  isSecure: false,
  isHttpOnly: false
});

// register helpers
server.register([Inert, Vision], (err) => {
  if (err) throw err;

  // handlebars templating
  server.views({
    engines: { hbs: Handlebars },
    relativeTo: Path.join(__dirname, '..', 'views'),
    layoutPath: './layouts',
    layout: 'main',
    partialsPath: './partials',
    helpersPath: './helpers'
  });
});

// connect to router
server.route(routes);

// export the server
module.exports = server;
