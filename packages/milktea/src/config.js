/* webpack 配置 */
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import loaders from './loaders/loaders';
import devPlugins from './plugins/dev.plugins';
import proPlugins from './plugins/pro.plugins';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string } 开发模式还是生产模式
   * entry { any } 文件入口
   * html { Object } html配置
   * plugins { Array } 自定义扩展插件
   */
  const { mode, entry, html, plugins }: {
    mode: string,
    entry: any,
    html: {
      template: string
    },
    plugins: Array
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { template }: { template: string } = html || {};

  // webpack配置
  const config: Object = {
    mode,
    entry,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: [loaders(sweetConfig)] },
    plugins: [
      // html模板
      new HtmlWebpackPlugin({
        inject: true,
        template,
        mode
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...isDevelopment ? devPlugins(sweetConfig) : proPlugins(),
      ...plugins ? plugins : []
    ]
  };

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