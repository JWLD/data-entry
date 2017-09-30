const Cookie = require('cookie');
const JsonWebToken = require('jsonwebtoken');
const Request = require('request');

const spotifyController = module.exports = {};

// SEARCH SPOTIFY FOR ALBUM
spotifyController.findAlbum = {
  method: 'GET',
  path: '/spotify',
  handler: (request, reply) => {
    const jwt = Cookie.parse(request.headers.cookie || '').jwt;
    if (!jwt) return reply('No access token provided').code(401);

    const access_token = JsonWebToken.verify(jwt, process.env.SECRET).access_token;

    // build request
    const options = {
      url: `https://api.spotify.com/v1/search?type=album&q=artist:John%20Powell%20album:Fair%20Game`,
      json: true,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };

    // make request to spotify
    Request(options, (err, response, body) => {
      if (err) return reply(`Spotify Album Search Error: ${err}`).code(500);

      const topResult = body.albums.items[0];

      if (topResult) {
        return reply({
          id: topResult.id,
          imgUrl: topResult.images[1].url
        });
      } else {
        return reply('No albums found on Spotify');
      }
    });
  }
}
