const JsonWebToken = require('jsonwebtoken');
const Request = require('request');

const spotifyController = module.exports = {};

// SEARCH SPOTIFY FOR ALBUM
spotifyController.findAlbum = (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.send('No access token provided.');

  const access_token = JsonWebToken.verify(jwt, process.env.SECRET).access_token;

  // build request
  const options = {
    url: encodeURI(`https://api.spotify.com/v1/search?type=album&q=artist:${req.query.artist} album:${req.query.album}`),
    json: true,
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  };

  // make request to spotify
  Request(options, (err, response, body) => {
    if (err || body.error) return res.send(`Spotify Album Search Error: ${err || body.error.message}`);

    const topResult = body.albums.items[0];

    if (topResult) {
      return res.send({
        id: topResult.id,
        imgUrl: topResult.images[1].url
      });
    } else {
      return res.send('No albums found on Spotify.');
    }
  });
}
