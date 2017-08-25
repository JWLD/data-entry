'use strict';

const Request = require('request');
const JsonWebToken = require('jsonwebtoken');

const handler = (request, reply) => {
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

  // make POST request to spotify for access_token
  Request(options, (error, response, body) => {
    if (error) return console.log(error);

    getSpotifyUsername(body, reply);
  });
};

const getSpotifyUsername = (tokenBody, reply) => {
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: `Bearer ${tokenBody.access_token}`
    }
  };

  // use access_token to get username from Spotify
  Request(options, (error, response, body) => {
    if (error) return console.log(error);

    const parsed = JSON.parse(body);

    // create JWT
    tokenBody.user = parsed.id;
    const token = JsonWebToken.sign(tokenBody, process.env.SECRET);

    reply.view('home', {
      user: parsed.id
    }).state('jwt', token);
  });
};

module.exports = {
  method: 'GET',
  path: '/redirect',
  handler
};
