import * as process from 'node:process';
import _ from 'lodash';
import type { Configuration, Stats } from 'webpack';
import webpackConfig from './config.js';
import webpackServerRenderConfig from './server.js';
import webpackDllConfig from './dll.js';
import configFile, { type ConfigFile, type GetConfigFileReturn } from './utils/configFile.js';
import type { SweetConfig, SweetOptions, Environment, SweetConfigArgs, FuncArgs } from './utils/types.js';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd(), // 主目录
  environment: 'client'     // 当前环境
};

/* 获取配置 */
async function getConfig(environment: Environment, sweetConfig: SweetConfigArgs): Promise<SweetConfig> {
  if (typeof sweetConfig === 'string') {
    // 自定义配置文件路径
    const cfg: GetConfigFileReturn = await configFile(sweetOptions, sweetConfig);
    const modules: ConfigFile = ('default' in cfg) ? cfg.default : cfg;

    return typeof modules === 'function' ? await modules({ environment }) : modules;
  } else if (_.isPlainObject(sweetConfig)) {
    // 自定义配置文件
    return sweetConfig as SweetConfig;
  } else {
    // 默认的配置文件
    const cfg: GetConfigFileReturn = await configFile(sweetOptions);
    const modules: ConfigFile = ('default' in cfg) ? cfg.default : cfg;

    return typeof modules === 'function' ? await modules({ environment }) : modules;
  }
}

/* webpack的回调函数，只显示错误 */
export function callbackOnlyError(err: Error, stats: Stats): void {
  if (err) {
    console.error(err);
  } else {
    console.log(stats.toString({
      colors: true,
      assets: false,
      entrypoints: false,
      builtAt: false,
      hash: false,
      modules: false,
      version: false,
      timings: false
    }));
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
 * @param { SweetConfig | string | null | undefined } args.sweetConfig - webpack配置，覆盖文件，优先级最高
 * @param { string } args.mode - 开发环境，覆盖配置的开发环境
 * @param { string } args.webpackLog - 覆盖日志的显示
 * @param { boolean } args.hot - 添加webpack.HotModuleReplacementPlugin插件，开启热更新功能
 * @param { 'sockjs' | 'ws' } args.socket - socket类型
 */
export async function config(args: FuncArgs = {}): Promise<Configuration> {
  const { sweetConfig, mode, webpackLog, hot, socket }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('client', sweetConfig);

  if (cfg) {
    mode && (cfg.mode = mode);
    webpackLog && (cfg.webpackLog = webpackLog);
    hot && (cfg.hot = hot);
    socket && (cfg.socket = socket);
  }

  return await webpackConfig(cfg, sweetOptions);
}

/**
 * 服务器端渲染的webpack配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig - webpack配置，覆盖文件，优先级最高
 * @param { string } args.mode - 开发环境，覆盖配置的开发环境
 * @param { string } args.webpackLog - 覆盖日志的显示
 */
export async function serverRenderConfig(args: FuncArgs = {}): Promise<Configuration> {
  const { sweetConfig, mode, webpackLog }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('server', sweetConfig);

  sweetOptions.environment = 'server';

  if (cfg) {
    mode && (cfg.mode = mode);
    webpackLog && (cfg.webpackLog = webpackLog);
  }

  return await webpackServerRenderConfig(cfg, sweetOptions);
}

/**
 * webpack的dll文件配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig - webpack配置，覆盖文件，优先级最高
 * @param { string } args.webpackLog - 覆盖日志的显示
 */
export async function dllConfig(args: FuncArgs = {}): Promise<Configuration> {
  const { sweetConfig, webpackLog }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('dll', sweetConfig);

  sweetOptions.environment = 'dll';

  if (cfg) {
    webpackLog && (cfg.webpackLog = webpackLog);
  }

  return webpackDllConfig(cfg, sweetOptions);
}

export default {
  callbackOnlyError,
  callback,
  config,
  serverRenderConfig,
  dllConfig
};