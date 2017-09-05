'use strict';

module.exports = {
  method: 'GET',
  path: '/{file*}',
  handler: {
    directory: {
      path: './public'
    }
  }
};
