import * as path from 'node:path';
import _ from 'lodash';
import webpack from 'webpack';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';
import { handleDllProgress } from './plugins/handleProgress.js';
import CacheConfig from './config/cacheConfig.js';
import { extensions } from './utils/utils.js';
import type { SweetConfig, SweetOptions } from './utils/types.js';

/**
 * webpack dll扩展配置
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
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

  /* 设置文件输出 */
  const webpackOutput: Configuration['output'] = {
    path: path.join(sweetOptions.basicPath, CacheConfig.Dll),
    filename: '[name].js',
    library: {
      name: '[name]_[hash:5]',
      type: 'var'
    }
  };

  if (ecmascript) {
    webpackOutput.globalObject = 'globalThis';
  }

  /* webpack插件 */
  const webpackPlugins: Configuration['plugins'] = [
    new webpack.DllPlugin({
      path: path.join(sweetOptions.basicPath, CacheConfig.Dll, 'manifest.json'),
      name: '[name]_[hash:5]'
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ];

  // 进度条
  if (!webpackLog || webpackLog === 'progress') {
    webpackPlugins.push(new WebpackBar({
      name: 'dll',
      color: 'green'
    }));
  } else {
    webpackPlugins.push(new webpack.ProgressPlugin(handleDllProgress));
  }

  /* webpack配置 */
  const webpackConfig: Configuration = {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: { extensions },
    target: ['web', ecmascript ? 'es2020' : 'es5'],
    performance: { hints: false },
    output: webpackOutput,
    plugins: webpackPlugins,
    experiments: {
      topLevelAwait: true
    }
  };

  /* chainWebpack: 扩展或修改webpack配置 */
  if (chainWebpack) {
    await chainWebpack(webpackConfig);
  }

  const mergeConfiguration: Configuration = {
    context,
    entry: dll?.length ? { dll } : undefined,
    externals,
    resolve
  };

  return merge(webpackConfig, mergeConfiguration);
}