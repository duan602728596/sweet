const path = require('path');

module.exports = {
  frame: 'react',
  dll: ['react'],
  entry: {
    index: [path.join(__dirname, 'src/index.js')]
  },
  loaders: {
    js: {
      test: /.*\.jsx?$/,
      use: ['babel-loader'],
      include: /src/
    }
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  }
};