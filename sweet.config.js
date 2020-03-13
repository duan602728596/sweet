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
    dll: [
      'react',
      'prop-types',
      'react-router',
      'react-router-dom',
      'redux',
      'react-redux',
      'redux-actions',
      'redux-thunk',
      'immutable',
      'redux-immutable',
      'reselect',
      'react-helmet'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.js')],
      other: [path.join(__dirname, 'src/other.js')]
    },
    output: {
      publicPath: '/'
    },
    serverRender: true,
    serverEntry: {
      server: [path.join(__dirname, 'src/server.js')]
    },
    js: {
      plugins,
      exclude: /node_modules/
    },
    sass: {
      include: /src/
    },
    css: {
      modifyVars: {
        // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
        '@primary-color': '#f5222d'
      },
      include: /node_modules[\\/]_?antd/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug'), excludeChunks: ['other'] },
      { template: path.join(__dirname, 'src/other.pug'), excludeChunks: ['index'] }
    ],
    filesMap: true
  };

  if (isDev) {
    config.resolve = {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    };
  }

  return config;
}