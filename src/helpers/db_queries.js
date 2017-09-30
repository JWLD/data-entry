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
    'INSERT INTO artists (name, discogs_id) VALUES ($1, $2)',
    [
      data.name,
      data.id
    ],
    callback
  );
};

dbQueries.addAlbum = (connPool, data, callback) => {
  connPool.query(
    'INSERT INTO albums (title, year, category, discogs_id, spotify_id, spotify_img, artist_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [
      data.title,
      data.year,
      data.category,
      data.discogs_id,
      data.spotify_id,
      data.spotify_img,
      data.artist_id
    ],
    callback
  );
};
