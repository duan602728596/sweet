import * as process from 'process';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import { Configuration } from 'webpack';
import webpackConfig from './config';
import webpackServerRenderConfig from './server';
import webpackDllConfig from './dll';
import { SweetConfig, SweetOptions } from './utils/types';
import getSweetConfigFile from './utils/getSweetConfigFile';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* webpack的回调函数 */
export function callback(err: Error, stats: webpack.Stats): void {
  console.log(stats.toString({
    colors: true
  }));
}

/**
 * webpack配置
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function config(sweetConfig?: SweetConfig | string | null, mode?: 'development' | 'production' | 'none'): Configuration {
  let config: SweetConfig | null | undefined;

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
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 * @param { string } mode: 开发环境，覆盖配置的开发环境
 */
export function serverRenderConfig(sweetConfig?: SweetConfig | string | null, mode?: 'development' | 'production' | 'none'): Configuration {
  let config: SweetConfig | null | undefined;

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
 * @param { object | string | null } sweetConfig: webpack配置，覆盖文件，优先级最高
 */
export function dllConfig(sweetConfig?: SweetConfig | string | null): Configuration {
  let config: SweetConfig | null | undefined;

  if (typeof sweetConfig === 'string') {
    config = getSweetConfigFile(sweetOptions, sweetConfig);
  } else if (_.isPlainObject(sweetConfig)) {
    config = sweetConfig;
  } else {
    config = getSweetConfigFile(sweetOptions);
  }

  return webpackDllConfig(config, sweetOptions);
}