var login = (function() {
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

  configureLoginButtons();
})();
