import * as path from 'node:path';
import _ from 'lodash';
import type { Configuration } from 'webpack';
import Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import { moduleExists } from '@sweet-milktea/utils';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { extensions, isTsconfigJsonExists, changeSweetConfig } from './utils/utils';
import CacheConfig from './config/cacheConfig';
import createFileName from './config/fileNameConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * webpack 服务器端渲染配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
  changeSweetConfig(sweetConfig);

  const config: Config = new Config();
  const sweetConfigModified: SweetConfig = _.omit(sweetConfig, ['hot']);
  const {
    mode,
    context,
    serverEntry,
    serverOutput,
    serverExternals,
    resolve,
    rules,
    noParse,
    plugins,
    serverDevtool,
    serverChainWebpack,
    typescript
  }: SweetConfig = sweetConfigModified;
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
        cacheDirectory: path.join(sweetOptions.basicPath, CacheConfig.WebpackServer)
      } : false
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist-server'))
    .publicPath('')
    .filename('[name].js')
    .library({
      type: 'commonjs'
    } as any)
    .globalObject('globalThis')
    .merge({ assetModuleFilename: createFileName(isDevelopment) });

  // forkTsCheckerWebpackPlugin配置
  sweetOptions.forkTsCheckerWebpackPlugin = !!(
    (moduleExists('typescript') as string | boolean)
    && typescript?.forkTsCheckerWebpackPlugin !== false
    && (await isTsconfigJsonExists(sweetOptions, typescript)));

  // loaders
  await loaders(sweetConfigModified, sweetOptions, config);

  // plugins
  await basicPlugins(sweetConfigModified, sweetOptions, config);

  // optimization
  optimization(sweetConfigModified, sweetOptions, config, true);

  /* serverChainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (serverChainWebpack) {
    await serverChainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
    context,
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

  return merge(config.toConfig(), mergeConfiguration);
}