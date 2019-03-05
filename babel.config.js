/* Babel config for babel-eslint */

module.exports = function(api) {
  api.cache.never();

  return {
    presets: ['@babel/preset-typescript'],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-optional-catch-binding',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-optional-chaining'
    ]
  };
};