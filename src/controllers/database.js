const connPool = require('../../database/db_connect');

const dbController = module.exports = {};

// ARTISTS ROUTE - CHECK IF ARTIST EXISTS IN DB
dbController.artists = {
  method: 'GET',
  path: '/db-artists',
  handler: (request, reply) => {
    reply('Hello World');
  }
};