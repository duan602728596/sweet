import * as path from 'path';
import * as _ from 'lodash';
import type { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { extensions, isTsconfigJsonExists, moduleExists } from './utils/utils';
import { webpackServerCache } from './config/cacheConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * webpack 服务器端渲染配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig | null | undefined, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();
  const SCFG: SweetConfig = _.omit(sweetConfig, ['hot']);
  const {
    mode,
    serverEntry,
    serverOutput,
    serverExternals,
    resolve,
    rules,
    noParse,
    plugins,
    serverDevtool,
    serverChainWebpack,
    ts
  }: SweetConfig = SCFG;
  const isDevelopment: boolean = mode === 'development';

  // 合并配置
  config
    .merge({
      mode,
      devtool: serverDevtool ?? (isDevelopment ? 'eval-source-map' : 'source-map'),
      resolve: { extensions },
      target: ['node', 'node10'],
      performance: { hints: false },
      node: {
        __filename: true,
        __dirname: true
      },

      // 文件缓存
      cache: isDevelopment ? {
        type: 'filesystem',
        cacheDirectory: path.join(sweetOptions.basicPath, webpackServerCache)
      } : false
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist-server'))
    .publicPath('')
    .filename('[name].js')
    .library('[name]')
    .libraryTarget('umd')
    .globalObject('globalThis');

  // forkTsCheckerWebpackPlugin配置
  sweetOptions.forkTsCheckerWebpackPlugin = !!(
    moduleExists('typescript')
    && ts?.forkTsCheckerWebpackPlugin !== false
    && isTsconfigJsonExists(sweetOptions, ts));

  // loaders
  loaders(SCFG, sweetOptions, config);

  // plugins
  basicPlugins(SCFG, sweetOptions, config);

  // optimization
  optimization(SCFG, sweetOptions, config, true);

  /* serverChainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (serverChainWebpack) {
    serverChainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
    entry: serverEntry,
    output: serverOutput,
    externals: serverExternals,
    resolve,
    // 添加其他的rules
    module: {
      noParse,
      rules
    },
    // 添加自定义的plugins
    plugins,
    experiments: {
      topLevelAwait: true
    }
  };

  /* @ts-ignore 合并自定义配置 */
  return merge(config.toConfig(), mergeConfiguration);
}