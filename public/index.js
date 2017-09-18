var dataEntry = (function() {
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

  var artistListener = function() {
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
  };

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

  var addArtistListener = function() {
    document.getElementById('artist-result-add').addEventListener('click', function() {
      var selection = Array.from(document.getElementsByClassName('artist-result')).filter((artist) => {
        return artist.classList.contains('select-artist');
      });

      var data = {
        name: selection[0].dataset.name,
        id: selection[0].dataset.id
      };

      dataEntry.makeRequest('POST', '/db-artists', data, function(err, res) {
        if (err) return console.log('Error adding artist to DB: ', err);

        console.log(res);
      });
    });
  };

  // invoke immediately
  configureLoginButtons();
  artistListener();
  addArtistListener();

  // export
  return {
    makeRequest: makeRequest
  }
})();
