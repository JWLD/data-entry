const connPool = require('../../database/db_connect');
const dbQueries = require('../helpers/db_queries');

const dbController = module.exports = {};

// ARTISTS ROUTE - CHECK IF ARTIST EXISTS IN DB
dbController.checkArtist = {
  method: 'GET',
  path: '/db-artists',
  handler: (request, reply) => {
    dbQueries.checkArtist(connPool, request.query.q, (err, res) => {
      if (err) return reply(`ERROR CHECKING ARTIST: ${err}`).code(500);

      // return true or false depending on whether artist exists or not
      return reply(res.rows[0].exists);
    });
  }
};

// ARTISTS ROUTE - ADD NEW ARTIST TO DB
dbController.addArtist = {
  method: 'POST',
  path: '/db-artists',
  handler: (request, reply) => {
    dbQueries.addArtist(connPool, JSON.parse(request.payload), (err, res) => {
      if (err) return reply(`ERROR ADDING ARTIST: ${err}`).code(500);

      return reply(res);
    });
  }
};
