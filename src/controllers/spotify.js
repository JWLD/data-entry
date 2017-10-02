const JsonWebToken = require('jsonwebtoken');
const Request = require('request');

const spotifyController = module.exports = {};

// SEARCH SPOTIFY FOR ALBUM
spotifyController.findAlbum = (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) return res.status(401).send('Missing access token - please log in to use this feature.');

  // decode the JWT
  const decoded = JsonWebToken.verify(jwt, process.env.SECRET);

  // search for various artists if this is the second attempt
  const artist = req.query.retry ? 'various artists' : req.query.artist;

  // build request
  const options = {
    url: encodeURI(`https://api.spotify.com/v1/search?type=album&q=artist:${artist} album:${req.query.album}`),
    json: true,
    headers: {
      Authorization: `Bearer ${decoded.access_token}`
    }
  };

  // make request to spotify
  Request(options, (err, response, body) => {
    if (err || body.error) return res.status(500).send(`Error searching Spotify for album: ${err || body.error.message}`);

    // if expired and refresh token, then refresh
    console.log(decoded.refresh_token);
    // return res.redirect(`/refresh?token=${decoded.refresh_token}`);
    // if expired and no refresh token, display error msg

    const topResult = body.albums.items[0];

    if (topResult) {
      return res.send({
        id: topResult.id,
        imgUrl: topResult.images[1].url
      });
    } else {
      // make a second attempt
      if (!req.query.retry) {
        return res.redirect(`${req.url}&retry=true`);
      }

      return res.status(404).send('Album not found on Spotify.');
    }
  });
}
