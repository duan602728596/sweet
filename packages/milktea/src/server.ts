import * as path from 'node:path';
import _ from 'lodash';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import { moduleExists } from '@sweet-milktea/utils';
import loaders from './loaders/loaders.js';
import basicPlugins from './plugins/plugins.js';
import optimization from './optimization/optimization.js';
import { webpackMergeObject, extensions, extensionAlias, isTsconfigJsonExists } from './utils/utils.js';
import CacheConfig from './config/cacheConfig.js';
import createFileName from './config/fileNameConfig.js';
import type { SweetConfig, SweetOptions, ModifyWebpackConfigReturn } from './utils/types.js';

/**
 * webpack 服务器端渲染配置
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
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
    typescript,
    modifyWebpackServerConfig
  }: SweetConfig = sweetConfigModified;
  const isDevelopment: boolean = mode === 'development';

  /* 设置文件输出 */
  const webpackOutput: Configuration['output'] = {
    path: path.join(sweetOptions.basicPath, 'dist-server'),
    publicPath: '',
    filename: '[name].mjs',
    library: { type: 'module' },
    globalObject: 'globalThis',
    assetModuleFilename: createFileName(isDevelopment)
  };

  /* webpack配置 */
  const webpackConfig: Configuration = {
    mode,
    devtool: serverDevtool ?? (isDevelopment ? 'eval-source-map' : 'source-map'),
    resolve: { extensions, extensionAlias },
    target: ['node', 'node22'],
    performance: { hints: false },
    node: {
      __filename: true,
      __dirname: true
    },
    cache: isDevelopment ? {
      type: 'filesystem',
      cacheDirectory: path.join(sweetOptions.basicPath, CacheConfig.WebpackServer)
    } : false,
    output: webpackOutput,
    experiments: {
      topLevelAwait: true,
      outputModule: true
    }
  };

  // forkTsCheckerWebpackPlugin配置
  sweetOptions.forkTsCheckerWebpackPlugin = !!(
    (moduleExists('typescript') as string | boolean)
    && typescript?.forkTsCheckerWebpackPlugin !== false
    && (await isTsconfigJsonExists(sweetOptions, typescript)));

  // loaders
  await loaders(sweetConfigModified, sweetOptions, webpackConfig);

  // plugins
  await basicPlugins(sweetConfigModified, sweetOptions, webpackConfig);

  // optimization
  optimization(sweetConfigModified, sweetOptions, webpackConfig, true);

  const webpackLoadedConfig: Configuration = {
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
    plugins
  };

  const webpackServerConfig: Configuration = merge(webpackConfig, webpackLoadedConfig);

  /* 扩展或修改webpack配置 */
  if (modifyWebpackServerConfig) {
    const modifiedConfig: ModifyWebpackConfigReturn = await modifyWebpackServerConfig(webpackServerConfig, webpackMergeObject);

    if (modifiedConfig) return modifiedConfig;
  }

  return webpackServerConfig;
}