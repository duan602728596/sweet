import * as path from 'path';
import * as _ from 'lodash';
import type { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import type{ Output } from 'webpack-chain';
import { merge } from 'webpack-merge';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { extensions, isTsconfigJsonExists, moduleExists } from './utils/utils';
import { webpackCache } from './config/cacheConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * webpack 配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<Configuration> {
  const config: Config = new Config();
  const SCFG: SweetConfig = _.omit(sweetConfig, [
    'serverRender',
    'serverEntry',
    'serverOutput',
    'serverExternals',
    'serverDevtool',
    'serverChainWebpack'
  ]);
  const {
    mode,
    entry,
    output,
    externals,
    resolve,
    rules,
    noParse,
    plugins,
    devtool,
    chainWebpack,
    js,
    ts,
    webpackLog = 'progress'
  }: SweetConfig = SCFG;
  const ecmascript: boolean = !!js?.ecmascript;
  const isDevelopment: boolean = mode === 'development';

  // webpack配置
  const filename: string = isDevelopment ? '[name].js' : '[name]_[chunkhash:15].js';

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
        cacheDirectory: path.join(sweetOptions.basicPath, webpackCache)
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
    .filename(filename)
    .when(ecmascript, (chainConfigOutput: Output): void => {
      chainConfigOutput.globalObject('globalThis');
    });

  // forkTsCheckerWebpackPlugin配置
  sweetOptions.forkTsCheckerWebpackPlugin = !!(
    moduleExists('typescript')
    && ts?.forkTsCheckerWebpackPlugin !== false
    && (await isTsconfigJsonExists(sweetOptions, ts)));

  // loaders
  await loaders(SCFG, sweetOptions, config);

  // plugins
  await basicPlugins(SCFG, sweetOptions, config);

  // optimization
  optimization(SCFG, sweetOptions, config, false);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    await chainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
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

  /* @ts-ignore 合并自定义配置 */
  return merge(config.toConfig(), mergeConfiguration);
}