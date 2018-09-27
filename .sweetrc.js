import path from 'path';
import process from 'process';

const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  frame: 'vue',
  dll: [
    'vue/dist/vue',
    'vue-router/dist/vue-router',
    'vuex/dist/vuex'
  ],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isDevelopment ? 'script/[name].js' : 'script/[chunkhash:5].js',
    chunkFilename: isDevelopment ? 'script/[name].js' : 'script/[chunkhash:5].js',
    publicPath: '/'
  },
  rules: [
    {
      test: /dll\.js/,
      use: [{
        loader: 'file-loader',
        options: {
          name: isDevelopment ? '[name].[ext]' : '[hash:5].[ext]',
          outputPath: 'script/'
        }
      }]
    }
  ],
  js: {
    plugins: [['import', { libraryName: 'iview', libraryDirectory: 'src/components' }]],
    exclude: /(dll\.js|node_modules)/
  },
  sass: { include: /src/ },
  css: {
    modules: false,
    modifyVars: {
      // https://github.com/iview/iview/blob/3.x/src/styles/custom.less
      '@primary-color': '#58b957',
      '@layout-header-background': '#58b957'
    },
    include: /node_modules[\\/]iview/
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
};