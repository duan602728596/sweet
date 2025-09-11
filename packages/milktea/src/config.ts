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
 * webpack 配置
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
    'serverChainWebpack'
  ]);
  const {
    mode,
    context,
    entry,
    output,
    externals,
    resolve,
    rules,
    noParse,
    plugins,
    devtool,
    javascript,
    typescript,
    webpackLog = 'progress',
    modifyWebpackConfig
  }: SweetConfig = sweetConfigModified;
  const ecmascript: boolean = !!javascript?.ecmascript;
  const isDevelopment: boolean = mode === 'development';

  /* 设置文件输出 */
  const webpackOutput: Configuration['output'] = {
    publicPath: '',
    path: path.join(sweetOptions.basicPath, 'dist'),
    filename: isDevelopment ? '[name].js' : '[name]_[chunkhash:15].js',
    assetModuleFilename: createFileName(isDevelopment)
  };

  if (ecmascript) {
    webpackOutput.globalObject = 'globalThis';
  }

  /* webpack配置 */
  const webpackConfig: Configuration = {
    mode,
    devtool: devtool ?? (isDevelopment ? 'eval-source-map' : false),
    resolve: { extensions, extensionAlias },
    target: ['web', ecmascript ? 'es2020' : 'es5'],
    performance: { hints: false },
    experiments: {
      topLevelAwait: true
    },
    output: webpackOutput
  };

  // 文件缓存
  if (isDevelopment) {
    Object.assign(webpackConfig, {
      cache: {
        type: 'filesystem',
        cacheDirectory: path.join(sweetOptions.basicPath, CacheConfig.Webpack)
      }
    });
  }

  // 日志
  if (webpackLog === 'progress') {
    Object.assign(webpackConfig, {
      infrastructureLogging: { level: 'warn' },
      stats: { // webpack >= 5.13.0时，webpack-dev-middleware根据这个配置输出
        colors: true,
        assets: false,
        entrypoints: false,
        builtAt: false,
        hash: false,
        modules: false,
        version: false,
        timings: false
      }
    });
  }

  /* forkTsCheckerWebpackPlugin配置 */
  sweetOptions.forkTsCheckerWebpackPlugin = !!(
    (moduleExists('typescript') as string | boolean)
    && typescript?.forkTsCheckerWebpackPlugin !== false
    && (await isTsconfigJsonExists(sweetOptions, typescript)));

  // loaders
  await loaders(sweetConfigModified, sweetOptions, webpackConfig);

  // plugins
  await basicPlugins(sweetConfigModified, sweetOptions, webpackConfig);

  // optimization
  optimization(sweetConfigModified, sweetOptions, webpackConfig, false);

  const webpackLoadedConfig: Configuration = {
    context,
    entry,
    output,
    externals,
    resolve,
    // 添加其他的rules
    module: {
      noParse,
      rules
    },
    // 添加自定义的plugins
    plugins
  };

  const webpackClientConfig: Configuration = merge(webpackConfig, webpackLoadedConfig);

  /* 扩展或修改webpack配置 */
  if (modifyWebpackConfig) {
    const modifiedConfig: ModifyWebpackConfigReturn = await modifyWebpackConfig(webpackClientConfig, webpackMergeObject);

    if (modifiedConfig) return modifiedConfig;
  }

  return webpackClientConfig;
}