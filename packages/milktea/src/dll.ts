import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import type { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import type { Output } from 'webpack-chain';
import { merge } from 'webpack-merge';
import * as WebpackBar from 'webpackbar';
import { handleDllProgress } from './plugins/handleProgress';
import { dllCache } from './config/cacheConfig';
import { extensions } from './utils/utils';
import type { SweetConfig, SweetOptions, JS } from './utils/types';

/**
 * webpack dll扩展配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();
  const SCFG: SweetConfig = _.omit(sweetConfig, [
    'serverRender',
    'serverEntry',
    'serverOutput',
    'serverExternals',
    'serverDevtool',
    'serverChainWebpack',
    'hot'
  ]);
  const {
    dll,
    externals,
    resolve,
    chainWebpack,
    js = {},
    webpackLog = 'progress'
  }: SweetConfig = SCFG;
  const ecmascript: boolean = !!js.ecmascript;

  // 合并配置
  config
    .merge({
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions },
      target: ['web', ecmascript ? 'es2020' : 'es5'],
      performance: { hints: false }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, dllCache))
    .filename('[name].js')
    .library('[name]_[hash:5]')
    .libraryTarget('var')
    .when(ecmascript, (output: Output): void => {
      output.globalObject('globalThis');
    });

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
    }]);

  // 进度条
  if (!webpackLog || webpackLog === 'progress') {
    config
      .plugin('webpackbar')
      .use(WebpackBar, [{
        name: 'dll',
        color: 'green'
      }]);

  } else {
    config
      .plugin('webpack.ProgressPlugin')
      .use(webpack.ProgressPlugin, [handleDllProgress]);
  }

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