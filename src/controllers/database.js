const connPool = require('../../database/db_connect');
const dbQueries = require('../helpers/db_queries');

const dbController = module.exports = {};

// ARTISTS ROUTE - CHECK IF ARTIST EXISTS IN DB
dbController.checkArtist = (req, res) => {
  dbQueries.checkArtist(connPool, req.query.q, (err, result) => {
    if (err) return res.status(500).send(`Error checking DB for artist: ${err}`);

    // return true or false depending on whether artist exists or not
    return res.send(result.rows[0].exists);
  });
};

// ARTISTS ROUTE - ADD NEW ARTIST TO DB
dbController.addArtist = (req, res) => {
  dbQueries.addArtist(connPool, req.body, (err, result) => {
    if (err) return res.status(500).send(`Error adding artist to DB: ${err}`);

    return res.send(result);
  });
};

// ALBUMS ROUTE - ADD NEW ALBUM TO DB
dbController.addAlbum = (req, res) => {
  dbQueries.addAlbum(connPool, req.body, (err, result) => {
    if (err) return res.status(500).send(`Error adding album to DB: ${err}`);

    return res.send(result);
  });
}
