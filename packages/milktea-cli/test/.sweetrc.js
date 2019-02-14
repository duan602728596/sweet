import path from 'path';

export default {
  frame: 'react',
  dll: ['react'],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  loaders: {
    js: {
      test: /.*\.jsx?$/,
      use: ['babel-loader']
    }
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  }
};