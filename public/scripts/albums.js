var albums = (function() {
  // make request for artist's albums
  document.getElementById('artist-result-search').addEventListener('click', function() {
    var url = '/discogs-albums?q=' + dataEntry.state.selectedArtist.id;
    if (document.getElementById('mock').checked) url += '&mock=true';

    dataEntry.showMessage('Searching Discogs for albums...');

    dataEntry.makeRequest('GET', url, null, function(err, res) {
      if (err) {
        dataEntry.showMessage('Error: ' + err);
        return console.log('Albums discogs search error: ', err);
      }

      dataEntry.showMessage('Success!');

      document.getElementById('slider').innerHTML = res;
      document.getElementById('album-result-add').classList.remove('inactive');
      document.getElementById('album-result-skip').classList.remove('inactive');

      setUpCounter();
      spotifyListeners();
    });
  });

  // initialise counter element
  var setUpCounter = function() {
    var albums = document.querySelectorAll('.album-form');

    if (albums.length) {
      var counter = document.getElementById('album-counter');
      counter.innerHTML = '1 / ' + albums.length;
      dataEntry.state.totalAlbums = albums.length;
    }
  };

  // add listeners to each album slide
  var spotifyListeners = function() {
    // query spotify listeners
    Array.from(document.querySelectorAll('.media-button.query')).forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        var currentIndex = dataEntry.state.totalAlbums - dataEntry.state.currentAlbum;
        var albumName = document.getElementById('album-input-title-' + currentIndex).value;
        var url = encodeURI('/spotify?artist=' + dataEntry.state.selectedArtist.name + '&album=' + albumName);

        dataEntry.showMessage('Searching Spotify for this album...');

        dataEntry.makeRequest('GET', url, null, function(err, res) {
          if (err) {
            dataEntry.showMessage('Error: ' + err);
            return console.log('Spotify album search error: ', err);
          }

          dataEntry.showMessage('Success!');

          var idInput = document.getElementById('album-input-spotify_id-' + currentIndex);
          var artInput = document.getElementById('album-input-artwork-' + currentIndex);
          var check = document.getElementById('check-result-' + currentIndex);

          var parsed = JSON.parse(res);

          idInput.value = parsed.id;
          idInput.classList.remove('neutral');
          idInput.classList.add('good');

          artInput.value = parsed.imgUrl;
          artInput.classList.remove('neutral');
          artInput.classList.add('good');

          check.classList.remove('inactive');
          check.href = 'https://open.spotify.com/album/' + parsed.id;
        });
      });
    });
  }

  // slide next album in
  var nextAlbum = function() {
    if (dataEntry.state.currentAlbum < dataEntry.state.totalAlbums) {
      var slider = document.querySelector('.slider');

      // move slider to the right by window width
      var currentPos = Number(slider.style.transform.slice(11, -3));
      var newPos = currentPos += window.innerWidth;
      slider.style.transform = 'translateX(' + newPos + 'px)';

      incrementCounter();
    }
  };

  // update the counter
  var incrementCounter = function() {
    var counter = document.getElementById('album-counter');
    dataEntry.state.currentAlbum++;
    counter.innerHTML = dataEntry.state.currentAlbum + ' / ' + dataEntry.state.totalAlbums;
  };

  // add an album to the DB
  document.getElementById('album-result-add').addEventListener('click', function(e) {
    e.preventDefault();

    // extract correct form data
    var currentIndex = dataEntry.state.totalAlbums - dataEntry.state.currentAlbum;
    var form = document.getElementById('album-form-' + currentIndex).elements;

    var data = {
      title: form.title.value,
      year: form.year.value,
      category: form.category.value,
      discogs_id: form.discogs_id.value,
      spotify_id: form.spotify_id.value,
      spotify_img: form.spotify_img.value,
      artist_id: dataEntry.state.selectedArtist.id
    };

    // convert empty fields to null values
    if (!data.spotify_id) data.spotify_id = null;
    if (!data.spotify_img) data.spotify_img = null;

    dataEntry.showMessage('Adding album to the database...');

    // submit form
    dataEntry.makeRequest('POST', '/db-albums', JSON.stringify(data), function(err, res) {
      if (err) {
        dataEntry.showMessage('Error: ', err);
        return console.log('Error adding album to DB: ', err);
      }

      dataEntry.showMessage('Success!');

      console.log(res);
    });

    // load next slide
    nextAlbum();
  });

  // skip an album
  document.getElementById('album-result-skip').addEventListener('click', function() {
    nextAlbum();
  });
})();
