module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'targets': {
          'browsers': ['node 6']
        },
        'debug': false,
        'modules': 'commonjs',
        'useBuiltIns': false
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties'
  ],
  cache: false
};