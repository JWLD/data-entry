const JsonWebToken = require('jsonwebtoken');

const viewsController = module.exports = {};

// HOME ROUTE - RENDER HOME VIEW
viewsController.home = {
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
