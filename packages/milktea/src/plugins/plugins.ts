/* 插件配置 */
import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as VueLoaderPlugin from 'vue-loader/lib/plugin';
import { requireModule } from '../utils/utils';
import { SweetConfig, SweetOptions, TS } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * html { object }: html配置
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   * loaders { object }: loaders
   */
  const { mode, html, frame, serverRender, ts }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const tsOptions: TS = ts || {};

  // 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? requireModule(path.join(__dirname, 'devPlugins'))
    : requireModule(path.join(__dirname, 'proPlugins'));

  // moment
  config
    .plugin('webpack.IgnorePlugin')
    .use(webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }]);

  // typescript
  config
    .when(!!tsOptions.typescript, (config: Config): void => {
      config
        .plugin('webpack.WatchIgnorePlugin')
        .use(webpack.WatchIgnorePlugin, [/(less|sass|scss|styl|css)\.d\.ts$/]);
    });

  // env plugin
  envPlugins(sweetConfig, sweetOptions, config);

  // html模板
  if (html && typeof _.isArray(html) && !serverRender) {
    let index: number = 0;

    for (const item of html) {
      const info: { name: string } = path.parse(item.template);

      config
        .plugin(`html-webpack-plugin: ${ index }`)
        .use(HtmlWebpackPlugin, [{
          inject: true,
          template: item.template,
          filename: `${ info.name }.html`,
          excludeChunks: item.excludeChunks,
          mode,
          hash: !isDevelopment
        }]);

      index += 1;
    }
  }

  config.when(frame === 'vue',
    (config: Config): void => {
      config
        .plugin('vue')
        .use(VueLoaderPlugin);
    }
  );
}