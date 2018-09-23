/* 插件配置 */
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

export default function(sweetConfig: Object = {}): Array{
  /**
   * mode { string }: 开发模式还是生产模式
   * html { Object }: html配置
   * plugins { Array }: 自定义扩展插件
   * frame { ?string }: 是否为react或vue模式
   */
  const { mode, html, plugins, frame }: {
    mode: string,
    html: Array<{
      template: string,
      excludeChunks: Array<string>
    }>,
    plugins: Array,
    frame: ?string
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? require('./devPlugins').default
    : require('./proPlugins').default;

  // 合并插件
  const pluginArr: [] = [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ...envPlugins(sweetConfig),
    ...plugins ? plugins : []
  ];

  // html模板
  if(html && typeof html === 'object' && Object.prototype.toString.call(html) === '[object Array]'){
    for(const item: Object of html){
      pluginArr.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: item.template,
          excludeChunks: item.excludeChunks,
          mode
        })
      );
    }
  }

  // vue
  if(frame === 'vue'){
    pluginArr.push(new VueLoaderPlugin());
  }

  return pluginArr;
}