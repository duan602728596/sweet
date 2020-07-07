import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import type { Configuration, Entry } from 'webpack';
import * as Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import { createPresetEnv } from './config/babelConfig';
import { handleDefaultProgress } from './plugins/handleProgress';
import createHandleProgressBar from './plugins/handleProgressBar';
import { babelCache, dllCache } from './config/cacheConfig';
import { extensions } from './utils/utils';
import type { SweetConfig, SweetOptions, JS } from './utils/types';

/**
 * webpack dll扩展配置
 * @param { SweetConfig | null | undefined } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig | null | undefined, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();
  const sweetConfigCopy: SweetConfig = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, dll, externals, resolve, chainWebpack, js, webpackLog = 'progress' }: SweetConfig = sweetConfigCopy;

  const jsOptions: JS = js ?? {};
  const { ecmascript, targets: customTargets }: JS = jsOptions;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // 合并配置
  config
    .merge({
      mode: 'development',
      devtool: isDevelopment ? 'inline-source-map' : false,
      resolve: { extensions },
      performance: { hints: false }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, dllCache))
    .filename('[name].js')
    .library('[name]_[hash:5]')
    .libraryTarget('var')
    .globalObject('this');

  // babel
  config
    .when(!ecmascript,
      (config: Config): void => {
        config
          .module
          .rule('dll')
          .use('babel-loader')
          .loader('babel-loader')
          .options({
            presets: [createPresetEnv(customTargets, false, true)],
            cacheDirectory: path.join(sweetOptions.basicPath, babelCache),
            configFile: false,
            babelrc: false
          });
      }
    );

  // plugin
  config
    // dll
    .plugin('webpack.DllPlugin')
    .use(webpack.DllPlugin, [{
      path: path.join(sweetOptions.basicPath, dllCache, 'manifest.json'),
      name: '[name]_[hash:5]'
    }])
    .end()
    // moment
    .plugin('webpack.IgnorePlugin')
    .use(webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }])
    .end()
    // 进度条
    .plugin('webpack.ProgressPlugin')
    .use(
      webpack.ProgressPlugin,
      [!webpackLog || webpackLog === 'progress' ? createHandleProgressBar(false) : handleDefaultProgress]
    );

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    chainWebpack(config);
  }

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry: { dll } as Entry,
    externals,
    resolve
  });
}