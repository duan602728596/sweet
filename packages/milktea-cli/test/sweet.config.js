import path from 'node:path';
import { metaHelper } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);

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