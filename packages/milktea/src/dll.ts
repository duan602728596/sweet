import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import type { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import { createPresetEnv } from './config/babelConfig';
import { handleDefaultProgress } from './plugins/handleProgress';
import createHandleProgressBar from './plugins/handleProgressBar';
import { babelCache, dllCache } from './config/cacheConfig';
import { extensions } from './utils/utils';
import __TODO_WEBPACK5_BETA30__ from './utils/webpack5Beta30'; // TODO: 以后会删除
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
  const { ecmascript, targets: customTargets }: JS = js ?? {};
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
      target: __TODO_WEBPACK5_BETA30__ ? [ecmascript ? 'es2020' : 'es5'] : undefined, // TODO: 以后会删除
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

  /**
   * TODO: [webpack@5.0.0-beta.30] 重写esm的加载方法
   *   see issues: https://github.com/webpack/webpack/issues/11467
   *               https://github.com/babel/babel/issues/12058
   */
  if (__TODO_WEBPACK5_BETA30__) {
    config.merge({
      module: {
        rule: {
          esm: {
            test: /^.*\.m?js$/i,
            resolve: {
              fullySpecified: false
            },
            type: 'javascript/auto'
          }
        }
      }
    });
  }

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

  const mergeConfiguration: Configuration = {
    entry: dll?.length ? { dll } : undefined,
    externals,
    resolve,
    experiments: {
      topLevelAwait: true
    }
  };

  /* @ts-ignore 合并自定义配置 */
  return merge(config.toConfig(), mergeConfiguration);
}