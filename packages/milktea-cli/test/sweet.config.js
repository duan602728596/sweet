import path from 'node:path';

export default function(info) {
  return {
    frame: 'react',
    dll: ['react'],
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    typescript: {
      forkTsCheckerWebpackPlugin: false
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js'
    }
  };
}