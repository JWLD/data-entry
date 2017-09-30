var dataEntry = (function() {
  var state = {
    totalAlbums: 0,
    currentAlbum: 1,
    selectedArtist: null
  };

  // view state
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 192) {
      console.log(dataEntry.state);
    }

    if (e.key === 'q') {
      dataEntry.makeRequest('GET', '/spotify', null, function(err, res) {
        console.log(res);
      });
    }
  });

  // XHR request function
  var makeRequest = function(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(null, xhr.responseText);
      } else if (xhr.readyState === 4) {
        callback(xhr.responseText, null);
      }
    }
    xhr.open(method, url);
    if (method === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  // configure login / logout buttons depending on cookies
  var configureLoginButtons = function() {
    var loginButton = document.getElementById('login-button');
    var logoutButton = document.getElementById('logout-button');

    // event listener for spotify icon
    document.getElementById('spotify-icon').addEventListener('click', function() {
      document.querySelector('.login-button-wrap').classList.toggle('show-login-buttons');
    });

    // delete cookies when logout button clicked
    logoutButton.addEventListener('click', function() {
      document.cookie = 'jwt=; expires=Thu 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'user=; expires=Thu 01 Jan 1970 00:00:00 UTC;';
      location.href = '/';
    });

    // extract user cookie
    var user = document.cookie.split('; ').find(function(cookie) {
      return cookie.includes('user=');
    });

    // if user has logged in with Spotify
    if (user) {
      user = user.slice(5);
      loginButton.innerHTML = user;

      loginButton.classList.add('inactive');
      logoutButton.classList.remove('inactive');
    } else {
      loginButton.classList.remove('inactive');
      logoutButton.classList.add('inactive');
    }
  };

  // submit artist search
  document.getElementById('artist-search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var count = document.getElementById('result-count').value;
      var url = '/discogs-artists?q=' + e.target.value + '&count=' + count;

      dataEntry.makeRequest('GET', url, null, function(err, res) {
        if (err) return console.log('Artist discogs search error: ', err);

        document.getElementById('artist-results').innerHTML = res;

        artistPicListeners();
      });
    }
  });

  var artistPicListeners = function() {
    var artistButtons = Array.from(document.getElementsByClassName('artist-image'));

    artistButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var selected = button.parentElement;
        selected.classList.toggle('select-artist');

        // set both result buttons to inactive before searching
        document.getElementById('artist-result-add').classList.add('inactive');
        document.getElementById('artist-result-search').classList.add('inactive');

        // if user has selected an artist
        if (selected.classList.contains('select-artist')) {
          // remove classes from other pics
          artistButtons.forEach(function(_button) {
            if (_button !== button) {
              _button.parentElement.classList.remove('select-artist');
              _button.parentElement.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
            }
          });

          // update state
          state.selectedArtist = {
            name: button.dataset.name,
            id: button.dataset.id
          }

          // query DB to see if artist exists or not
          if (selected.classList.contains('select-artist')) {
            // show overlay with querying DB message
            selected.getElementsByClassName('artist-overlay')[0].classList.remove('hidden');

            var url = '/db-artists?q=' + button.dataset.id;

            dataEntry.makeRequest('GET', url, null, function(err, res) {
              if (err) return console.log('Artist DB search error: ', err);

              configureArtistButtons(res, selected);
            });
          }
        // when user deselects the current artist
        } else {
          selected.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
          state.selectedArtist = null;
        }
      });
    });
  };

  var configureArtistButtons = function(exists, selected) {
    var artistAdd = document.getElementById('artist-result-add');
    var artistSearch = document.getElementById('artist-result-search');

    // check if there is a selection when DB query returns
    var selection = Array.from(document.getElementsByClassName('artist-result')).filter((artist) => {
      return artist.classList.contains('select-artist');
    });

    if (selection.length > 0) {
      if (exists === 'true') {
        artistAdd.classList.add('inactive');
        artistSearch.classList.remove('inactive');
      } else {
        artistAdd.classList.remove('inactive');
        artistSearch.classList.add('inactive');
      }

      selected.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
    }
  };

  document.getElementById('artist-result-add').addEventListener('click', function() {
    var selection = Array.from(document.getElementsByClassName('artist-result')).filter((artist) => {
      return artist.classList.contains('select-artist');
    });

    var data = {
      name: selection[0].dataset.name,
      id: Number(selection[0].dataset.id)
    };

    dataEntry.makeRequest('POST', '/db-artists', JSON.stringify(data), function(err, res) {
      if (err) return console.log('Error adding artist to DB: ', err);

      // change active buttons
      document.getElementById('artist-result-add').classList.add('inactive');
      document.getElementById('artist-result-search').classList.remove('inactive');
    });
  });

  var nextAlbum = function() {
    if (state.currentAlbum < state.totalAlbums) {
      var slider = document.querySelector('.slider');

      // move slider to the right by window width
      var currentPos = Number(slider.style.transform.slice(11, -3));
      var newPos = currentPos += window.innerWidth;
      slider.style.transform = 'translateX(' + newPos + 'px)';

      incrementCounter();
    }
  };

  var setUpCounter = function() {
    var albums = document.querySelectorAll('.album-results-wrap');

    if (albums.length) {
      var counter = document.getElementById('album-counter');
      counter.innerHTML = '1 / ' + albums.length;
      state.totalAlbums = albums.length;
    }
  };

  var incrementCounter = function() {
    var counter = document.getElementById('album-counter');
    state.currentAlbum++;
    counter.innerHTML = state.currentAlbum + ' / ' + state.totalAlbums;
  };

  // make request for artist's albums
  document.getElementById('artist-result-search').addEventListener('click', function() {
    var url = '/discogs-albums?q=' + state.selectedArtist.id;

    dataEntry.makeRequest('GET', url, null, function(err, res) {
      if (err) return console.log(err);

      document.getElementById('slider').innerHTML = res;

      setUpCounter();
      addAlbumListeners();
    });
  });

  // add listeners to each album slide
  var addAlbumListeners = function() {
    // category dropdown listeners
    var dropdowns = Array.from(document.querySelectorAll('.category-select')).forEach(function(dropdown) {
      dropdown.addEventListener('change', function(e) {
        if (e.target.value) {
          e.target.classList.remove('bad');
          e.target.classList.add('good');
        } else {
          e.target.classList.remove('good');
          e.target.classList.add('bad');
        }
      });
    });

    // query spotify listeners
    var querySpotify = Array.from(document.querySelectorAll('.media-button.query')).forEach(function(button) {
      button.addEventListener('click', function() {
        dataEntry.makeRequest('GET', '/spotify', null, function(err, res) {
          if (err) return console.log(err);

          console.log(res);
        });
      });
    });
  }

  addAlbumListeners();

  // event listener for adding an album to DB
  document.getElementById('album-result-add').addEventListener('click', function() {
    nextAlbum();
  });

  // event listener for skipping an album
  document.getElementById('album-result-skip').addEventListener('click', function() {
    nextAlbum();
  });

  // invoke immediately
  configureLoginButtons();

  // export
  return {
    makeRequest: makeRequest,
    state: state
  };
})();
