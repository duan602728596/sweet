/* 插件配置 */
import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as VueLoaderPlugin from 'vue-loader/lib/plugin';
import { requireModule } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * html { object }: html配置
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   * loaders { object }: loaders
   */
  const { mode, html, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 根据模式加载插件
  const envPlugins: Function = isDevelopment
    ? requireModule(path.join(__dirname, 'devPlugins'))
    : requireModule(path.join(__dirname, 'proPlugins'));

  config
    // moment
    .plugin('webpack.IgnorePlugin')
    .use(webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }])
    .end()
    // 注入环境变量
    .plugin('webpack.DefinePlugin-sweet-env')
    .use(webpack.DefinePlugin, [{
      'process.env.SWEET_SERVER_RENDER': !!serverRender // 判断是否为ssr渲染
    }]);

  // env plugin
  envPlugins(sweetConfig, sweetOptions, config);

  // html模板
  if (html && typeof _.isArray(html) && !serverRender) {
    let index: number = 0;

    for (const item of html) {
      const info: { name: string } = path.parse(item.template);

      config
        .plugin(`html-webpack-plugin: ${ index }`)
        // @ts-ignore
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