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

  return {
    makeRequest: makeRequest,
    state: state
  };
})();
