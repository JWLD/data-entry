const Cookie = require('cookie');
const Jwt = require('jsonwebtoken');
const Request = require('request');

const spotifyController = module.exports = {};

// SEARCH SPOTIFY FOR ALBUM
spotifyController.findAlbum = {
  method: 'GET',
  path: '/spotify',
  handler: (request, reply) => {
    const jwt = Cookie.parse(request.headers.cookie || '').jwt;
    if (!jwt) return reply('No access token provided').code(401);

    const access_token = Jwt.verify(jwt, process.env.SECRET).access_token;

    // build request
    const options = {
      url: `https://api.spotify.com/v1/search?type=album&q=artist:Hans%20Zimmer%20album:Paperhouse`,
      json: true,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };

    // make request to spotify
    Request(options, (err, response, body) => {
      if (err) return reply(`Spotify Album Search Error: ${err}`).code(500);

      console.log(body.albums.items);
    });
  }
}
