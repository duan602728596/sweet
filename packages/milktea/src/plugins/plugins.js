/* 插件配置 */
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { isArray } from '../utils';

export default function(sweetConfig: Object, sweetOptions: Object): Array{
  /**
   * mode { string }: 开发模式还是生产模式
   * html { Object }: html配置
   * plugins { Array }: 自定义扩展插件
   * frame { ?string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, html, plugins, frame, serverRender }: {
    mode: string,
    html: Array<{
      template: string,
      excludeChunks: Array<string>
    }>,
    plugins: Array,
    frame: ?string,
    serverRender: boolean
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? require('./devPlugins').default
    : require('./proPlugins').default;

  // 合并插件
  const pluginArr: [] = [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ...envPlugins(sweetConfig, sweetOptions),
    ...plugins ? plugins : []
  ];

  // html模板
  if(html && typeof isArray(html) && !serverRender){
    for(const item: Object of html){
      const info: Object = path.parse(item.template);

      pluginArr.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: item.template,
          filename: `${ info.name }.html`,
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