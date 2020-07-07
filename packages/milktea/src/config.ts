import * as path from 'path';
import * as _ from 'lodash';
import type { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { extensions } from './utils/utils';
import { webpackCache } from './config/cacheConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * webpack 配置
 * @param { SweetConfig | null | undefined } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig | null | undefined, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();
  const sweetConfigCopy: SweetConfig = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
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
    webpackLog = 'progress'
  }: SweetConfig = sweetConfigCopy;
  const ecmascript: boolean | undefined = js?.ecmascript;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  const filename: string = isDevelopment ? 'scripts/[name].js' : 'scripts/[chunkhash:15].js';

  // 合并配置
  const mergeConfig: { [key: string]: any } = {
    mode,
    devtool: devtool ?? (isDevelopment ? 'eval-source-map' : false),
    resolve: { extensions },
    performance: { hints: false }
  };

  // 文件缓存
  if (isDevelopment) {
    mergeConfig.cache = {
      type: 'filesystem',
      cacheDirectory: path.join(sweetOptions.basicPath, webpackCache)
    };
  }

  // 日志
  if (webpackLog === 'progress') {
    mergeConfig.infrastructureLogging = { level: 'warn' };
  }

  config.merge(mergeConfig);

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist'))
    .filename(filename)
    .globalObject('this');

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config, false);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    chainWebpack(config);
  }

  const mergeConfiguration: Configuration = {
    entry,
    output: {
      ecmaVersion: ecmascript ? 2015 : 5,
      ...(output || {})
    },
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

  /* @ts-ignore 合并自定义配置 */
  return merge(config.toConfig(), mergeConfiguration);
}