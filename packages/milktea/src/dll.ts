import * as path from 'node:path';
import _ from 'lodash';
import webpack from 'webpack';
import type { Configuration } from 'webpack';
import Config, { type Output } from 'webpack-chain';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';
import { handleDllProgress } from './plugins/handleProgress.js';
import CacheConfig from './config/cacheConfig.js';
import { extensions } from './utils/utils.js';
import type { SweetConfig, SweetOptions } from './utils/types.js';

/**
 * webpack dll扩展配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
  const config: Config = new Config();
  const sweetConfigModified: SweetConfig = _.omit(sweetConfig, [
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
    context,
    externals,
    resolve,
    chainWebpack,
    javascript,
    webpackLog = 'progress'
  }: SweetConfig = sweetConfigModified;
  const ecmascript: boolean = !!javascript?.ecmascript;

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
    .path(path.join(sweetOptions.basicPath, CacheConfig.Dll))
    .filename('[name].js')
    .library({
      name: '[name]_[hash:5]',
      type: 'var'
    } as any)
    .when(ecmascript, (output: Output): void => {
      output.globalObject('globalThis');
    });

  // plugin
  config
    // dll
    .plugin('webpack.DllPlugin')
    .use(webpack.DllPlugin, [{
      path: path.join(sweetOptions.basicPath, CacheConfig.Dll, 'manifest.json'),
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
    await chainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
    context,
    entry: dll?.length ? { dll } : undefined,
    externals,
    resolve,
    experiments: {
      topLevelAwait: true,
      outputModule: true
    }
  };

  return merge(config.toConfig(), mergeConfiguration);
}