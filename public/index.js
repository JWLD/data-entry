(function() {
  // extract JWT cookie
  var jwt = document.cookie.split('; ').find(function(cookie) {
    return cookie.includes('jwt=');
  });

  if (jwt) {
    jwt = jwt.slice(4);
  }

  // console.log(jwt);
})();
