module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 9']
        },
        debug: false,
        modules: 'commonjs',
        useBuiltIns: false
      }
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true
      }
    ]
  ],
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
    '@babel/plugin-proposal-optional-chaining',
  ],
  cache: false
};