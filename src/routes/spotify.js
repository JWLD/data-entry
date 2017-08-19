'use strict';

const Querystring = require('querystring');

const handler = (request, reply) => {
  const queries = Querystring.stringify({
    client_id: process.env.SPOTIFY_ID,
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/redirect'
  });

  return reply.redirect(`https://accounts.spotify.com/authorize?${queries}`);
};

module.exports = {
  method: 'GET',
  path: '/spotify',
  handler
};
