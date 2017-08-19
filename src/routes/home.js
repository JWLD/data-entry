'use strict';

module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    if (request.headers.cookie.includes('jwt=')) {
      reply.view('home', {
        token: true
      });
    } else {
      reply.view('home');
    }
  }
};
