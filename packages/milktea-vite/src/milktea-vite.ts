import * as process from 'process';
import { createServer, build as viteBuild, ViteDevServer } from 'vite';
import type { RollupOutput } from 'rollup';
import * as _ from 'lodash';
import configFile from './utils/configFile';
import type { SweetConfig, SweetOptions, SweetConfigArgs, FuncArgs } from './utils/types';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/* 获取配置 */
function getConfig(sweetConfig: SweetConfigArgs): SweetConfig {
  if (typeof sweetConfig === 'string') {
    // 自定义配置文件路径
    const config: SweetConfig | (() => SweetConfig) = configFile(sweetOptions, sweetConfig);

    return typeof config === 'function' ? config() : config;
  } else if (_.isPlainObject(sweetConfig)) {
    // 自定义配置文件
    return sweetConfig as SweetConfig;
  } else {
    // 默认的配置文件
    const config: SweetConfig | (() => SweetConfig) = configFile(sweetOptions);

    return typeof config === 'function' ? config() : config;
  }
}

/**
 * vite返回devServer
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export function config(args: FuncArgs = {}): Promise<ViteDevServer> {
  const { sweetConfig }: FuncArgs = args;
  const cfg: SweetConfig = getConfig(sweetConfig);

  return createServer();
}

/**
 * rollup配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export function build(args: FuncArgs = {}): Promise<RollupOutput | RollupOutput[]> {
  const { sweetConfig }: FuncArgs = args;
  const cfg: SweetConfig = getConfig(sweetConfig);

  return viteBuild();
}