const Querystring = require('querystring');
const Request = require('request');
const Compile = require('../helpers/compile');

const handler = (request, reply) => {
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
    const topResults = body.results.slice(0, 10);
    const html = Compile('artists', topResults);

    return reply(html);
  });
};

module.exports = {
  method: 'GET',
  path: '/artists',
  handler
};
