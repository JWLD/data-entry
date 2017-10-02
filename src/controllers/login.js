const Querystring = require('querystring');
const Request = require('request');
const JsonWebToken = require('jsonwebtoken');

const loginController = module.exports = {};

// LOGIN ROUTE - REDIRECT TO SPOTIFY AUTH PAGE
loginController.login = (req, res) => {
  const queries = Querystring.stringify({
    client_id: process.env.SPOTIFY_ID,
    response_type: 'code',
    redirect_uri: `${req.headers.referer}redirect`
  });

  return res.redirect(`https://accounts.spotify.com/authorize?${queries}`);
};

// REDIRECT ROUTE - POST REQUEST TO SPOTIFY FOR ACCESS TOKEN
loginController.redirect = (req, res) => {
  const data = {
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: 'http://localhost:3000/redirect',
    client_id: process.env.SPOTIFY_ID,
    client_secret: process.env.SPOTIFY_SECRET
  };

  const options = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    json: true,
    form: data
  };

  Request(options, (error, response, body) => {
    if (error) return res.status(500).send(`Error requesting access token from Spotify: ${error}`);

    getUserInfo(body, res);
  });
};

// USE ACCESS TOKEN TO GET USER INFO FROM SPOTIFY API
const getUserInfo = (tokenBody, res) => {
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: `Bearer ${tokenBody.access_token}`
    }
  };

  Request(options, (error, response, body) => {
    if (error) return res.status(500).send(`Error getting user info from Spotify: ${error}`);

    const parsed = JSON.parse(body);

    // create JWT and return info as cookies
    tokenBody.user = parsed.id;
    const token = JsonWebToken.sign(tokenBody, process.env.SECRET);

    res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 * 24 * 7 }); // 1 week
    res.cookie('user', parsed.id, { maxAge: 1000 * 60 * 60 * 24 * 7 }); // 1 week

    res.redirect('/');
  });
};

// REFRESH ROUTE - GET NEW ACCESS TOKEN FROM SPOTIFY
loginController.refresh = (req, res) => {
  const data = {
    grant_type: 'refresh_token',
    refresh_token: req.query.token,
    client_id: process.env.SPOTIFY_ID,
    client_secret: process.env.SPOTIFY_SECRET
  };

  const options = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    json: true,
    form: data
  };

  Request(options, (error, response, body) => {
    if (error) return res.status(500).send(`Error refreshing Spotify access token: ${error}`);

    console.log('RESPONSE:', body);
  });
};
