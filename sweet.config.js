import path from 'path';

export default function(info) {
  return {
    frame: 'vue',
    dll: [
      'vue',
      'vue-router',
      'vuex',
      'vue-meta',
      'classnames',
      '@vue/composition-api'
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
      plugins: [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]],
      exclude: /node_modules/
    },
    sass: {
      include: /src/
    },
    css: {
      modifyVars: {
        // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
        '@primary-color': '#58b957'
      },
      include: /node_modules[\\/]_?ant-design-vue/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug'), excludeChunks: ['other'] },
      { template: path.join(__dirname, 'src/other.pug'), excludeChunks: ['index'] }
    ],
    filesMap: true
  };
}