import path from 'path';

export default function(info) {
  return {
    frame: 'vue',
    dll: [
      '@ant-design/icons-vue',
      '@vueuse/head',
      'ant-design-vue',
      'classnames',
      'pinia',
      'vue',
      'vue-router'
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
    serverExternals: [
      function({ context, request }, callback) {
        if (/^vue(-router|x)?$/.test(request) || /^@vue\//.test(request) || /^pinia$/.test(request)) {
          callback(null, 'commonjs ' + request);
        } else {
          callback();
        }
      }
    ],
    javascript: {
      ecmascript: true,
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
}