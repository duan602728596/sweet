export default {
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
  cache: false
};