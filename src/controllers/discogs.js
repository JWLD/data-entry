const Querystring = require('querystring');
const Request = require('request');
const Compile = require('../helpers/compile');

const discogsController = module.exports = {};

// ARTISTS ROUTE - QUERY DISCOGS FOR ARTISTS
discogsController.artists = (req, res) => {
  // build request to Discogs API
  const queries = Querystring.stringify({
    type: 'artist',
    q: req.query.q,
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
    const topResults = body.results.slice(0, req.query.count);
    const html = Compile('artists', topResults);

    return res.send(html);
  });
};

// ALBUMS ROUTE - QUERY DISCOGS FOR ALBUMS
discogsController.albums = (req, res) => {
  // build discogs request
  const options = {
    url: `https://api.discogs.com/artists/${req.query.q}/releases?per_page=25`,
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

    return res.send(html);
  });
};
