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
        var url = '/artists?q=' + e.target.value + '&count=' + count;

        dataEntry.makeRequest('GET', url, null, function(err, res) {
          if (err) return console.log('Artist search error: ', err);

          document.getElementById('artist-results').innerHTML = res;

          artistPicListeners();
        });
      }
    });
  };

  var artistPicListeners = function() {
    var artistPics = Array.from(document.getElementsByClassName('artist-image'));

    artistPics.forEach(function(button) {
      button.addEventListener('click', function() {
        button.parentElement.classList.toggle('select-artist');
        button.parentElement.getElementsByClassName('artist-overlay')[0].classList.toggle('hidden');

        // remove class from other pics
        artistPics.forEach(function(pic) {
          if (pic !== button) {
            pic.parentElement.classList.remove('select-artist');
            pic.parentElement.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
          }
        });
      });
    });
  };

  // invoke immediately
  configureLoginButtons();
  artistListener();

  // export
  return {
    makeRequest: makeRequest
  }
})();
