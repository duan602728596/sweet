import * as process from 'process';
import * as _ from 'lodash';
import { Configuration, Stats } from 'webpack';
import webpackConfig from './config';
import webpackServerRenderConfig from './server';
import webpackDllConfig from './dll';
import { SweetConfig, SweetOptions, Mode, Log } from './utils/types';
import getSweetConfigFile from './utils/getSweetConfigFile';

type SweetConfigArgs = SweetConfig | string | null | undefined;
type Config = SweetConfig | null | undefined;

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* 获取配置 */
function getConfig(sweetConfig?: SweetConfigArgs): Config {
  if (typeof sweetConfig === 'string') {
    return getSweetConfigFile(sweetOptions, sweetConfig);
  } else if (_.isPlainObject(sweetConfig)) {
    return sweetConfig;
  } else {
    return getSweetConfigFile(sweetOptions);
  }
}

/* webpack的回调函数，只显示错误 */
export function callbackOnlyError(err: Error, stats: Stats): void {
  if (err) {
    console.error(err);
  }
}

/* webpack的回调函数 */
export function callback(err: Error, stats: Stats): void {
  if (err) {
    console.error(err);
  } else {
    console.log(stats.toString({
      colors: true
    }));
  }
}

/**
 * webpack配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 * @param { string } log: 覆盖日志的显示
 */
export function config(sweetConfig?: SweetConfigArgs, mode?: Mode, log?: Log): Configuration {
  const config: Config = getConfig(sweetConfig);

  if (config && mode) {
    config.mode = mode;
  }

  if (config && log) {
    config.log = log;
  }

  return webpackConfig(config, sweetOptions);
}

/**
 * 服务器端渲染的webpack配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 * @param { string } log: 覆盖日志的显示
 */
export function serverRenderConfig(sweetConfig?: SweetConfigArgs, mode?: Mode, log?: Log): Configuration {
  const config: Config = getConfig(sweetConfig);

  if (config && mode) {
    config.mode = mode;
  }

  if (config && log) {
    config.log = log;
  }

  return webpackServerRenderConfig(config, sweetOptions);
}

/**
 * webpack的dll文件配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } log: 覆盖日志的显示
 */
export function dllConfig(sweetConfig?: SweetConfigArgs, log?: Log): Configuration {
  const config: Config = getConfig(sweetConfig);

  if (config && log) {
    config.log = log;
  }

  return webpackDllConfig(config, sweetOptions);
}

export default {
  callbackOnlyError,
  callback,
  config,
  serverRenderConfig,
  dllConfig
};