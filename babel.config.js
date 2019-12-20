const _ = require('lodash');
const babelConfig = require('./scripts/babelConfig');

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

module.exports = function(api) {
  api.cache(true);

  return _.mergeWith(
    _.omit(babelConfig, ['cache']),
    {
      presets: ['@babel/preset-react']
    },
    customizer
  );
};