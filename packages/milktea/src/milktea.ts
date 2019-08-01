import * as process from 'process';
import * as _ from 'lodash';
import { Configuration, Stats } from 'webpack';
import webpackConfig from './config';
import webpackServerRenderConfig from './server';
import webpackDllConfig from './dll';
import { SweetConfig, SweetOptions, Mode } from './utils/types';
import getSweetConfigFile from './utils/getSweetConfigFile';

type SweetConfigArgs = SweetConfig | string | null | undefined;
type Config = SweetConfig | null | undefined;

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* webpack的回调函数 */
export function callback(err: Error, stats: Stats): void {
  console.log(stats.toString({
    colors: true
  }));
}

/**
 * webpack配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function config(
  sweetConfig?: SweetConfigArgs,
  mode?: Mode
): Configuration {
  let config: Config;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetOptions, sweetConfig);
  } else if (_.isPlainObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile(sweetOptions);
  }

  if (config && mode) {
    config.mode = mode;
  }

  return webpackConfig(config, sweetOptions);
}

/**
 * 服务器端渲染的webpack配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function serverRenderConfig(
  sweetConfig?: SweetConfigArgs,
  mode?: Mode
): Configuration {
  let config: Config;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetOptions, sweetConfig);
  } else if (_.isPlainObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile(sweetOptions);
  }

  if (config && mode) {
    config.mode = mode;
  }

  return webpackServerRenderConfig(config, sweetOptions);
}

/**
 * webpack的dll文件配置
 * @param { SweetConfig | string | null | undefined } sweetConfig: webpack配置，覆盖文件，优先级最高
 */
export function dllConfig(sweetConfig?: SweetConfigArgs): Configuration {
  let config: Config;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetOptions, sweetConfig);
  } else if (_.isPlainObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile(sweetOptions);
  }

  return webpackDllConfig(config, sweetOptions);
}

export default {
  callback,
  config,
  serverRenderConfig,
  dllConfig
};