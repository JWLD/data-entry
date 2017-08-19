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
  }

  const options = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    json: true,
    form: data
  }

  Request(options, (error, response, body) => {
    if (error) return console.log(error);

    const token = JsonWebToken.sign(body, process.env.SECRET);

    reply.view('home', {
      token: true
    }).state('jwt', {
      jwt: token
    });
  });
};

module.exports = {
  method: 'GET',
  path: '/redirect',
  handler
};
