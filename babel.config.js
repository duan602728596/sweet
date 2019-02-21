/* Babel config for babel-eslint */

module.exports = function(api) {
  api.cache.never();

  return {
    presets: [
      '@babel/preset-react',
      '@babel/preset-flow'
    ],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: false,
          useESModules: true
        }
      ]
    ]
  };
};