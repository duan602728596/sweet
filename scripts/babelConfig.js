module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 10']
        },
        debug: false,
        modules: 'commonjs',
        useBuiltIns: false
      }
    ]
  ],
  cache: false,
  ignore: [/node_modules/],
  extensions: ['.jsx', '.js', 'cjs']
};