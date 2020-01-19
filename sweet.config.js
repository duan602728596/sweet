import path from 'path';

export default function(info) {
  return {
    frame: 'react',
    dll: [
      'react',
      'react-dom',
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
    serverRender: true,
    serverEntry: {
      server: [path.join(__dirname, 'src/server.js')]
    },
    js: {
      plugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
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
      include: /node_modules[\\/]antd/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug'), excludeChunks: ['other'] },
      { template: path.join(__dirname, 'src/other.pug'), excludeChunks: ['index'] }
    ],
    filesMap: true
  };
}