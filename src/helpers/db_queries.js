const dbQueries = module.exports = {};

dbQueries.checkArtist = (connPool, id, callback) => {
  connPool.query(
    'SELECT EXISTS(SELECT 1 FROM artists WHERE discogs_id = $1)',
    [id],
    callback
  );
};

dbQueries.addArtist = (connPool, data, callback) => {
  connPool.query(
    'INSERT INTO artists (name, discogs_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT discogs_id FROM artists WHERE discogs_id = $2)',
    [
      data.name,
      data.id
    ],
    callback
  );
};
