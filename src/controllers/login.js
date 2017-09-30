const Querystring = require('querystring');
const Request = require('request');
const JsonWebToken = require('jsonwebtoken');

const loginController = module.exports = {};

// LOGIN ROUTE - REDIRECT TO SPOTIFY AUTH PAGE
loginController.login = {
  method: 'GET',
  path: '/login',
  handler: (request, reply) => {
    const queries = Querystring.stringify({
      client_id: process.env.SPOTIFY_ID,
      response_type: 'code',
      redirect_uri: 'http://localhost:3000/redirect'
    });

    return reply.redirect(`https://accounts.spotify.com/authorize?${queries}`);
  }
};

// REDIRECT ROUTE - POST REQUEST TO SPOTIFY FOR ACCESS TOKEN
loginController.redirect = {
  method: 'GET',
  path: '/redirect',
  handler: (request, reply) => {
    const data = {
      grant_type: 'authorization_code',
      code: request.query.code,
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
      if (error) return console.log(error);

      getUserInfo(body, reply);
    });
  }
};

// USE ACCESS TOKEN TO GET USER INFO FROM SPOTIFY API
const getUserInfo = (tokenBody, reply) => {
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: `Bearer ${tokenBody.access_token}`
    }
  };

  Request(options, (error, response, body) => {
    if (error) return console.log(error);

    const parsed = JSON.parse(body);

    // create JWT and return info as cookies
    tokenBody.user = parsed.id;
    const token = JsonWebToken.sign(tokenBody, process.env.SECRET);

    reply.redirect('/')
      .state('jwt', token)
      .state('user', parsed.id);
  });
};
