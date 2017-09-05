const server = require('./server');
require('dotenv').config();

// start the server
server.start((err) => {
  if (err) throw err;

  console.log(`Incredible things happening on port ${server.info.port}!`);
});
