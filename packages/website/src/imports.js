/* 按需加载 */

if (process.env.NODE_ENV === 'development') {
  module.exports = {
    // eslint-disable-next-line import/no-unresolved
    dll: require('../.sweet/dll/dll.js')
  };
} else {
  module.exports = {};
}