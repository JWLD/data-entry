var artists = (function() {
  // submit artist search
  document.getElementById('artist-search').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var count = document.getElementById('result-count').value;
      var url = '/discogs-artists?q=' + e.target.value + '&count=' + count;
      if (document.getElementById('mock').checked) url += '&mock=true';

      dataEntry.showMessage('Searching Discogs for artists...');

      dataEntry.makeRequest('GET', url, null, function(err, res) {
        if (err) {
          dataEntry.showMessage(err);
          return console.log(err);
        }

        document.getElementById('artist-results').innerHTML = res;
        dataEntry.showMessage('Success!');

        artistPicListeners();
      });
    }
  });

  // select / deselect an artist and query DB
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
          dataEntry.state.selectedArtist = {
            name: button.dataset.name,
            id: button.dataset.id
          }

          // query DB to see if artist exists or not
          if (selected.classList.contains('select-artist')) {
            // show overlay with querying DB message
            selected.getElementsByClassName('artist-overlay')[0].classList.remove('hidden');

            var url = '/db-artists?q=' + button.dataset.id;

            dataEntry.showMessage('Checking whether artist exists in database...');

            dataEntry.makeRequest('GET', url, null, function(err, res) {
              if (err) {
                dataEntry.showMessage(err);
                return console.log(err);
              }

              configureArtistButtons(res, selected);
            });
          }
          // when user deselects the current artist
        } else {
          selected.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
          dataEntry.state.selectedArtist = null;
        }
      });
    });
  };

  // configure add / search buttons depending on DB query result
  var configureArtistButtons = function(exists, selected) {
    var artistAdd = document.getElementById('artist-result-add');
    var artistSearch = document.getElementById('artist-result-search');

    // check if there is a selection when DB query returns
    var selection = Array.from(document.getElementsByClassName('artist-result')).filter((artist) => {
      return artist.classList.contains('select-artist');
    });

    if (selection.length > 0) {
      if (exists === 'true') {
        dataEntry.showMessage('Artist already exists in the database.');
        artistAdd.classList.add('inactive');
        artistSearch.classList.remove('inactive');
      } else {
        dataEntry.showMessage('Artist doesn\'t exist in the database.');
        artistAdd.classList.remove('inactive');
        artistSearch.classList.add('inactive');
      }

      selected.getElementsByClassName('artist-overlay')[0].classList.add('hidden');
    }
  };

  // add artist to DB
  document.getElementById('artist-result-add').addEventListener('click', function() {
    var data = {
      name: dataEntry.state.selectedArtist.name,
      id: dataEntry.state.selectedArtist.id
    };

    dataEntry.showMessage('Adding artist to the database...');

    dataEntry.makeRequest('POST', '/db-artists', data, function(err, res) {
      if (err) {
        dataEntry.showMessage(err);
        return console.log(err);
      }

      dataEntry.showMessage('Success!');

      // change active buttons
      document.getElementById('artist-result-add').classList.add('inactive');
      document.getElementById('artist-result-search').classList.remove('inactive');
    });
  });
})();
