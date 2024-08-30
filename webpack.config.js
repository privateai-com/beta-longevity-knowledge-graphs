const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv');

module.exports = {
  // other configurations
  plugins: [
    new Dotenv()
  ]
};