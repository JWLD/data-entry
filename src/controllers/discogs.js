const Querystring = require('querystring');
const Request = require('request');
const Compile = require('../helpers/compile');

const discogsController = module.exports = {};

// ARTISTS ROUTE - QUERY DISCOGS FOR ARTISTS
discogsController.artists = {
  method: 'GET',
  path: '/artists',
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
      if (error) return reply(`Discogs API Artists Error: ${error}`);

      // compile and return html partial using top n results
      const topResults = body.results.slice(0, request.query.count);
      const html = Compile('artists', topResults);

      return reply(html);
    });
  }
};
