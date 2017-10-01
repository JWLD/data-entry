var albums = (function() {
  // make request for artist's albums
  document.getElementById('artist-result-search').addEventListener('click', function() {
    var url = '/discogs-albums?q=' + dataEntry.state.selectedArtist.id;
    if (document.getElementById('mock').checked) url += '&mock=true';

    dataEntry.showMessage('Searching Discogs for albums...');

    dataEntry.makeRequest('GET', url, null, function(err, res) {
      if (err) {
        dataEntry.showMessage(err);
        return console.log(err);
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

        // extract album name and build URL
        var currentIndex = dataEntry.state.totalAlbums - dataEntry.state.currentAlbum;
        var albumName = document.getElementById('album-input-title-' + currentIndex).value;
        var url = encodeURI('/spotify?artist=' + dataEntry.state.selectedArtist.name + '&album=' + albumName);

        // display message to user
        dataEntry.showMessage('Searching Spotify for this album...');

        // make request to spotify for album
        dataEntry.makeRequest('GET', url, null, function(err, res) {
          if (err) {
            dataEntry.showMessage(err);
            return console.log(err);
          }

          dataEntry.showMessage('Success!');

          // do stuff with the result
          var check = document.getElementById('check-result-' + currentIndex);
          var artwork = document.getElementById('spotify-artwork-' + currentIndex);

          var parsed = JSON.parse(res);

          dataEntry.state.spotifyInfo = {
            id: parsed.id,
            imgUrl: parsed.imgUrl
          }

          check.classList.remove('inactive');
          check.href = 'https://open.spotify.com/album/' + parsed.id;

          artwork.style.backgroundImage = 'url(\'' + parsed.imgUrl + '\')';
        });
      });
    });

    // confirm spotify result listeners
    Array.from(document.querySelectorAll('.media-button.confirm')).forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        var currentIndex = dataEntry.state.totalAlbums - dataEntry.state.currentAlbum;
        var idInput = document.getElementById('album-input-spotify_id-' + currentIndex);
        var artInput = document.getElementById('album-input-artwork-' + currentIndex);
        var artwork = document.getElementById('spotify-artwork-' + currentIndex);

        artwork.classList.toggle('art-select');

        if (artwork.classList.contains('art-select')) {
          idInput.value = dataEntry.state.spotifyInfo.id;
          artInput.value = dataEntry.state.spotifyInfo.imgUrl;
        } else {
          idInput.value = null;
          artInput.value = null;
        }
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
    dataEntry.makeRequest('POST', '/db-albums', data, function(err, res) {
      if (err) {
        dataEntry.showMessage(err);
        return console.log(err);
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
