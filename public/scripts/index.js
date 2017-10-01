var dataEntry = (function() {
  var state = {
    totalAlbums: 0,
    currentAlbum: 1,
    selectedArtist: null,
    timeout: null
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
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  };

  // display on-screen message to user
  var showMessage = function(msg) {
    var msgBox = document.getElementById('message-box');
    msgBox.classList.add('show-message');
    msgBox.innerHTML = msg;

    // clear timeout if one exists
    if (dataEntry.state.timeout) clearTimeout(dataEntry.state.timeout);

    // hide after x seconds
    dataEntry.state.timeout = setTimeout(function() {
      msgBox.classList.remove('show-message');
      msgBox.innerHTML = null;
    }, 3000);
  }

  return {
    state: state,
    makeRequest: makeRequest,
    showMessage: showMessage
  };
})();
