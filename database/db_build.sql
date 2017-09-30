BEGIN;

DROP TABLE IF EXISTS artists, albums CASCADE;

CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  discogs_id INT NOT NULL UNIQUE
);

CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INT NOT NULL,
  category TEXT NOT NULL,
  discogs_id INT NOT NULL UNIQUE,
  spotify_id TEXT DEFAULT NULL,
  spotify_img TEXT DEFAULT NULL,
  artist_id INT REFERENCES artists (discogs_id)
);

INSERT INTO artists (name, discogs_id) VALUES
  ('Hans Zimmer', 59656);
INSERT INTO albums (title, year, category, discogs_id, spotify_id, spotify_img, artist_id) VALUES
  ('The Lion King', 1994, 'film', 1211512, '6V642KcHwzOSyYGwH58kgO', 'https://i.scdn.co/image/2d089ded23bcc0b28720b6ed247d9cce1e124d04', 59656);

COMMIT;
