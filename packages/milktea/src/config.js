/* webpack 配置 */
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import loaders from './loaders/loaders';
import devPlugins from './plugins/dev.plugins';
import proPlugins from './plugins/pro.plugins';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }
   * html { Object }: html配置
   * plugins { Array }: 自定义扩展插件
   * frame { ?string }: 是否为react或vue模式
   */
  const { mode = 'development', entry, output, externals, html, plugins, frame }: {
    mode: string,
    entry: any,
    output: any,
    externals: any,
    html: {
      template: string
    },
    plugins: Array,
    frame: ?string
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { template }: { template: string } = html || {};

  // webpack配置
  const config: Object = {
    mode,
    entry,
    output,
    externals,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: loaders(sweetConfig) },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...isDevelopment ? devPlugins(sweetConfig) : proPlugins(),
      ...plugins ? plugins : []
    ]
  };

  // html模板
  if(template){
    config.plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        template,
        mode
      })
    )
  }

  // vue
  if(frame === 'vue'){
    config.plugins.push(new VueLoaderPlugin())
  }

  if(!isDevelopment){
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.'
      },
      minimizer: [new TerserPlugin()]
    };
  }

  return config;
}