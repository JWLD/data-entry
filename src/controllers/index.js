const loginController = require('./login');

module.exports = [
  require('./static'),
  require('./home'),
  loginController.login,
  loginController.redirect,
  require('./artists')
];
