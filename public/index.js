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

  var addEventListeners = function() {
    // event listener for spotify icon
    document.getElementById('spotify-icon').addEventListener('click', function() {
      document.querySelector('.login-button-wrap').classList.toggle('show-login-buttons');
    });

    // delete cookies when logout button clicked
    document.getElementById('logout-button').addEventListener('click', function() {
      document.cookie = 'jwt=; expires=Thu 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'user=; expires=Thu 01 Jan 1970 00:00:00 UTC;';
      location.href = '/';
    });

    // submit artist search
    document.getElementById('artist-search').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const url = '/artists?q=' + e.target.value;

        dataEntry.makeRequest('GET', url, null, function(err, res) {
          if (err) return console.log('Artist search error: ', err);

          document.getElementById('artist-results').innerHTML = res;
        });
      }
    });
  };

  // configure login / logout buttons depending on cookies
  var configureLoginButtons = function() {
    var loginButton = document.getElementById('login-button');
    var logoutButton = document.getElementById('logout-button');

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

  // invoke immediately
  addEventListeners();
  configureLoginButtons();

  // export
  return {
    makeRequest: makeRequest
  }
})();
