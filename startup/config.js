const config = require('config');

module.exports = function() {
  //Configuration
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }
};