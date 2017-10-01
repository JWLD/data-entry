const JsonWebToken = require('jsonwebtoken');

const viewsController = module.exports = {};

// HOME ROUTE - RENDER HOME VIEW
viewsController.home = (req, res) => {
  if (req.cookies.jwt) {
    const decoded = JsonWebToken.decode(req.cookies.jwt);

    res.render('home', {
      user: decoded.user
    });
  } else {
    res.render('home');
  }
};
