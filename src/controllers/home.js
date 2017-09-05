const JsonWebToken = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    if (request.state.jwt) {
      const decoded = JsonWebToken.decode(request.state.jwt);

      reply.view('home', {
        user: decoded.user
      });
    } else {
      reply.view('home');
    }
  }
};
