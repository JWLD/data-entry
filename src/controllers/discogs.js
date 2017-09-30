const Querystring = require('querystring');
const Request = require('request');
const Compile = require('../helpers/compile');

const discogsController = module.exports = {};

// ARTISTS ROUTE - QUERY DISCOGS FOR ARTISTS
discogsController.artists = {
  method: 'GET',
  path: '/discogs-artists',
  handler: (request, reply) => {
    // build request to Discogs API
    const queries = Querystring.stringify({
      type: 'artist',
      q: request.query.q,
      token: process.env.DISCOGS_TOKEN
    });

    const options = {
      url: `https://api.discogs.com/database/search?${queries}`,
      headers: { 'User-Agent': 'https://github.com/JWLD' },
      json: true
    };

    Request(options, (error, response, body) => {
      if (error) return reply(`Discogs API Artists Error: ${error}`).code(500);

      // compile and return html partial using top n results
      const topResults = body.results.slice(0, request.query.count);
      const html = Compile('artists', topResults);

      return reply(html);
    });
  }
};

// ALBUMS ROUTE - QUERY DISCOGS FOR ALBUMS
discogsController.albums = {
  method: 'GET',
  path: '/discogs-albums',
  handler: (request, reply) => {
    // build discogs request
    const options = {
      url: `https://api.discogs.com/artists/${request.query.q}/releases?per_page=25`,
      headers: { 'User-Agent': 'https://github.com/JWLD' },
      json: true
    };

    // make request to discogs
    Request(options, (error, response, body) => {
      if (error) return reply(`Discogs API Albums Error: ${error}`).code(500);

      // process results - set main_release to id where main_release doesn't exist
      const releases = body.releases.map((release) => {
        const newObj = release;

        if (!newObj.main_release) {
          newObj.main_release = release.id;
        }

        return newObj;
      }).reverse();

      const html = Compile('albums', releases);

      return reply(html);
    });
  }
};
