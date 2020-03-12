import * as path from 'path';

export default function(info: object): object {
  return {
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
      path: path.join(__dirname, 'dist'),
      filename: '[name].build.js'
    }
  };
}