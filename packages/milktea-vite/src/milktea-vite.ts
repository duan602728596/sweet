import * as process from 'process';
import { createServer, build as viteBuild, ViteDevServer } from 'vite';
import type { RollupOutput } from 'rollup';
import * as _ from 'lodash';
import configFile from './utils/configFile';
import viteConfig from './config';
import viteClientBuild from './build';
import viteSSRBuild from './server';
import type { SweetConfig, SweetOptions, Environment, Info, SweetConfigArgs, FuncArgs } from './utils/types';

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd(), // 主目录
  environment: 'client'     // 当前环境
};

/* 获取配置 */
function getConfig(environment: Environment, sweetConfig: SweetConfigArgs): SweetConfig {
  if (typeof sweetConfig === 'string') {
    // 自定义配置文件路径
    const config: SweetConfig | ((info: Info) => SweetConfig) = configFile(sweetOptions, sweetConfig);

    return typeof config === 'function' ? config({ environment }) : config;
  } else if (_.isPlainObject(sweetConfig)) {
    // 自定义配置文件
    return sweetConfig as SweetConfig;
  } else {
    // 默认的配置文件
    const config: SweetConfig | ((info: Info) => SweetConfig) = configFile(sweetOptions);

    return typeof config === 'function' ? config({ environment }) : config;
  }
}

/**
 * vite返回devServer
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export function config(args: FuncArgs = {}): Promise<ViteDevServer> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = getConfig('client', sweetConfig);

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return createServer(viteConfig(cfg, sweetOptions));
}

/**
 * vite生产环境编译配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export function build(args: FuncArgs = {}): Promise<RollupOutput | RollupOutput[]> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = getConfig('client', sweetConfig);

  sweetOptions.environment = 'client';

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return viteBuild(viteClientBuild(cfg, sweetOptions));
}

/**
 * vite生产环境SSR编译配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export function serverRenderBuild(args: FuncArgs = {}): Promise<RollupOutput | RollupOutput[]> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = getConfig('server', sweetConfig);

  sweetOptions.environment = 'server';

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return viteBuild(viteSSRBuild(cfg, sweetOptions));
}

export default {
  config,
  build,
  serverRenderBuild
};