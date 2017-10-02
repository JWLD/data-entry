const Express = require('express');
const Handlebars = require('express-handlebars');
const Path = require('path');

// middleware
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const Favicon = require('serve-favicon');
const router = require('./controllers/router.js');

const app = Express();

app.engine('hbs', Handlebars({
  defaultLayout: 'main',
  partialsDir: Path.join(__dirname, '..', 'views', 'partials'),
  extname: 'hbs'
}));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');

// third-party
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(Favicon(Path.join(__dirname, '..', 'public', 'images', 'favicon.png')));

// built-in
app.use(Express.static('public'));

// custom
app.use(router);

module.exports = app;
