const devServer = require('./lib/devServer').default;
const proServer = require('./lib/proServer').default;
const hotClientEntry = require('./lib/hotClientEntry').default;

const server = {
  devServer,
  proServer,
  hotClientEntry
};

module.exports = server;
module.exports.default = server;