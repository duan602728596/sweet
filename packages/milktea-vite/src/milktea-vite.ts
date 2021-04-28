import * as process from 'process';
import { createServer, build as viteBuild, ViteDevServer } from 'vite';
import * as _ from 'lodash';
import type { RollupOutput, RollupWatcher } from 'rollup';
import configFile, { ConfigFile } from './utils/configFile';
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
async function getConfig(environment: Environment, sweetConfig: SweetConfigArgs): Promise<SweetConfig> {
  if (typeof sweetConfig === 'string') {
    // 自定义配置文件路径
    const cfg: ConfigFile = await configFile(sweetOptions, sweetConfig);

    return typeof cfg === 'function' ? await cfg({ environment }) : cfg;
  } else if (_.isPlainObject(sweetConfig)) {
    // 自定义配置文件
    return sweetConfig as SweetConfig;
  } else {
    // 默认的配置文件
    const cfg: ConfigFile = await configFile(sweetOptions);

    return typeof cfg === 'function' ? await cfg({ environment }) : cfg;
  }
}

/**
 * vite返回devServer
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export async function config(args: FuncArgs = {}): Promise<ViteDevServer> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('client', sweetConfig);

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return createServer(await viteConfig(cfg, sweetOptions));
}

/**
 * vite生产环境编译配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export async function build(args: FuncArgs = {}): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('client', sweetConfig);

  sweetOptions.environment = 'client';

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return viteBuild(await viteClientBuild(cfg, sweetOptions));
}

/**
 * vite生产环境SSR编译配置
 * @param { SweetConfig | string | null | undefined } args.sweetConfig: vite配置，覆盖文件，优先级最高
 */
export async function serverRenderBuild(args: FuncArgs = {}): Promise<RollupOutput | RollupOutput[] | RollupWatcher> {
  const { sweetConfig, mode }: FuncArgs = args;
  const cfg: SweetConfig = await getConfig('server', sweetConfig);

  sweetOptions.environment = 'server';

  if (cfg) {
    if (mode) {
      cfg.mode = mode;
    }
  }

  return viteBuild(await viteSSRBuild(cfg, sweetOptions));
}

export default {
  config,
  build,
  serverRenderBuild
};