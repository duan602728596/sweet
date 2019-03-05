/* 插件配置 */
import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as VueLoaderPlugin from 'vue-loader/lib/plugin';
import { requireModule, isArray } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<any> {
  /**
   * mode { string }: 开发模式还是生产模式
   * html { object }: html配置
   * plugins { Array<any> }: 自定义扩展插件
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, html, plugins, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? requireModule(path.join(__dirname, './devPlugins'))
    : requireModule(path.join(__dirname, './proPlugins'));

  // 合并插件
  const pluginArr: Array<any> = [
    ...plugins ? plugins : [],
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    ...envPlugins(sweetConfig, sweetOptions)
  ];

  // html模板
  if (html && typeof isArray(html) && !serverRender) {
    for (const item of html) {
      const info: { name: string } = path.parse(item.template);

      pluginArr.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: item.template,
          filename: `${ info.name }.html`,
          excludeChunks: item.excludeChunks,
          mode,
          hash: !isDevelopment
        })
      );
    }
  }

  // vue
  if (frame === 'vue') {
    pluginArr.push(new VueLoaderPlugin());
  }

  return pluginArr;
}