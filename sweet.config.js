import process from 'node:process';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

export default function(info) {
  const plugins = [
    !isDev && ['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]
  ].filter(Boolean);

  const config = {
    frame: 'react',
    dll: [
      'react',
      'react-dom/client',
      'prop-types',
      '@reduxjs/toolkit',
      'react-redux',
      'reselect',
      'react-router-dom',
      'react-helmet'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.js')],
      other: [path.join(__dirname, 'src/other.js')]
    },
    serverRender: true,
    serverEntry: {
      server: [path.join(__dirname, 'src/server.js')]
    },
    serverExternals: [
      function({ context, request }, callback) {
        if (/^react(-dom(\/server)?|-router(-dom(\/server)?)?)?|prop-types|@reduxjs\/toolkit|react-redux|reselect$/.test(request)) {
          callback(null, 'commonjs ' + request);
        } else {
          callback();
        }
      }
    ],
    javascript: {
      ecmascript: true,
      plugins,
      exclude: /node_modules/
    },
    sass: {
      include: /src/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug'), excludeChunks: ['other'] },
      { template: path.join(__dirname, 'src/other.pug'), excludeChunks: ['index'] }
    ],
    filesMap: true
  };

  return config;
}