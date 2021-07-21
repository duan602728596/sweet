import process from 'process';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export default function(info) {
  const plugins = [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]];

  if (!isDev) {
    plugins.unshift(['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]);
  }

  const config = {
    frame: 'react',
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    html: [{ template: path.join(__dirname, 'src/index.pug') }],
    javascript: {
      plugins,
      exclude: /node_modules|packages[\/]server/
    },
    sass: {
      include: /src/
    },
    css: {
      include: /node_modules/
    },
    rules: [{
      test: /^.*\.md$/i,
      type: 'asset/source'
    }]
  };

  return config;
}