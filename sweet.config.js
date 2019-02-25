import path from 'path';
import process from 'process';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

export default {
  frame: 'vue',
  dll: [
    'vue',
    'vue-router',
    'vuex'
  ],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  loaders: {
    svg: {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: ['vue-svg-loader']
    }
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
    plugins: [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]],
    exclude: /(dll\.js|node_modules)/
  },
  sass: { include: /src/ },
  css: {
    modules: false,
    modifyVars: {
      // https://github.com/vueComponent/ant-design-vue/blob/master/components/style/themes/default.less
      '@primary-color': '#58b957'
    },
    include: /node_modules[\\/]ant-design-vue/
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
};