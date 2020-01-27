if (process.env.SWEET_SERVER_RENDER) {
  module.exports = require('./asyncModuleNode');
} else {
  module.exports = require('./asyncModule');
}