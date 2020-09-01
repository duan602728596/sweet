if (process.env.SWEET_SERVER_RENDER) {
  module.exports = require('vue-router').createWebHistory;
} else {
  module.exports = require('vue-router').createMemoryHistory;
}