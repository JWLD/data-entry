require('dotenv').config();

const app = require('./app.js');

app.listen(app.get('port'), () => {
  console.log(`Server running at ${app.get('port')}`);
});
