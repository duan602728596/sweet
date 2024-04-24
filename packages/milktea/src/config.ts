import * as path from 'node:path';
import _ from 'lodash';
import type { Configuration } from 'webpack';
import Config, { type Output } from 'webpack-chain';
import { merge } from 'webpack-merge';
import { moduleExists } from '@sweet-milktea/utils';
import loaders from './loaders/loaders.js';
import basicPlugins from './plugins/plugins.js';
import optimization from './optimization/optimization.js';
import { extensions, isTsconfigJsonExists } from './utils/utils.js';
import CacheConfig from './config/cacheConfig.js';
import createFileName from './config/fileNameConfig.js';
import type { SweetConfig, SweetOptions } from './utils/types.js';

/**
 * webpack 配置
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
  const config: Config = new Config();
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
    chainWebpack,
    javascript,
    typescript,
    webpackLog = 'progress'
  }: SweetConfig = sweetConfigModified;
  const ecmascript: boolean = !!javascript?.ecmascript;
  const isDevelopment: boolean = mode === 'development';

  // 合并配置
  const mergeConfig: { [key: string]: any } = {
    mode,
    devtool: devtool ?? (isDevelopment ? 'eval-source-map' : false),
    resolve: { extensions },
    target: ['web', ecmascript ? 'es2020' : 'es5'],
    performance: { hints: false }
  };

  // 文件缓存
  if (isDevelopment) {
    Object.assign(mergeConfig, {
      cache: {
        type: 'filesystem',
        cacheDirectory: path.join(sweetOptions.basicPath, CacheConfig.Webpack)
      }
    });
  }

  // 日志
  if (webpackLog === 'progress') {
    Object.assign(mergeConfig, {
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

  config.merge(mergeConfig);

  // 设置文件输出
  config
    .output
    .publicPath('')
    .path(path.join(sweetOptions.basicPath, 'dist'))
    .filename(isDevelopment ? '[name].js' : '[name]_[chunkhash:15].js')
    .merge({ assetModuleFilename: createFileName(isDevelopment) })
    .when(ecmascript, (chainConfigOutput: Output): void => {
      chainConfigOutput.globalObject('globalThis');
    });

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
  optimization(sweetConfigModified, sweetOptions, config, false);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    await chainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
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
    plugins,
    experiments: {
      topLevelAwait: true
    }
  };

  return merge(config.toConfig(), mergeConfiguration);
}