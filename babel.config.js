const { createBabelPlugins } = require('@sweet-milktea/milktea/lib/config/babelConfig');

module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['@vue/babel-preset-jsx'],
    plugins: createBabelPlugins()
  };
};