const dbQueries = module.exports = {};

dbQueries.checkArtist = (connPool, id, callback) => {
  connPool.query(
    'SELECT EXISTS(SELECT 1 FROM artists WHERE discogs_id = $1)',
    [id],
    callback
  );
};
