import * as path from 'node:path';
import { glob, type GlobOptionsWithFileTypesFalse } from 'glob';
import _ from 'lodash';
import { requireCommonjsModule, requireModuleWithoutCache } from '@sweet-milktea/utils';
import useRegister from './babelRegister.js';
import type { SweetOptions, ControllersModule } from './types.js';

const DEFAULT_CONTROLLERS: string = 'controllers'; // 默认的controllers名

interface ControllersInfo {
  isAbsolute: boolean;
  dir: string;
  controllers: string;
}

/**
 * 获取controllers信息
 * @param { string } controllersDir - controllers的文件夹名
 */
export function getControllers(controllersDir?: string): ControllersInfo {
  const isAbsolute: boolean = controllersDir ? path.isAbsolute(controllersDir) : false;
  const dir: string = controllersDir ?? DEFAULT_CONTROLLERS;
  const controllers: string = path.join(dir, '**/*.{ts,mts,cts,tsx,js,mjs,cjs,jsx}').replace(/\\/g, '/');

  return { isAbsolute, dir, controllers };
}

/**
 * 加载controllers目录下的模块
 * @param { Array<string> } files - 文件名
 * @param { SweetOptions } sweetOptions
 * @param { ControllersInfo } controllersInfo
 * @param { boolean } [clearRequireModule] - 是否清除缓存
 */
export async function requireControllers(
  files: Array<string>,
  sweetOptions: SweetOptions,
  controllersInfo: ControllersInfo,
  clearRequireModule?: boolean
): Promise<Array<ControllersModule>> {
  const result: Array<ControllersModule> = [],
    defaultResult: Array<ControllersModule> = [];

  for (const file of files) {
    await useRegister(sweetOptions);

    const modules: ControllersModule | undefined = await (clearRequireModule
      ? requireModuleWithoutCache
      : requireCommonjsModule
    )(controllersInfo.isAbsolute ? file : path.join(sweetOptions.basicPath, file));

    // @ts-ignore
    if (typeof modules === 'object' && modules.url && modules.handler) {
      if (modules.url === '(.*)' || modules.url === '/(.*)') {
        defaultResult.push(modules);
      } else {
        result.push(modules);
      }
    }
  }

  return result.concat(defaultResult);
}

/**
 * 获取controllers目录下的所有模块
 * @param { SweetOptions } sweetOptions
 * @param { boolean } [clearRequireModule] - 是否清除缓存
 */
export async function getControllersFiles(sweetOptions: SweetOptions, clearRequireModule?: boolean): Promise<Array<ControllersModule>> {
  const controllersInfo: ControllersInfo = getControllers(sweetOptions.controllersDir);
  let options: GlobOptionsWithFileTypesFalse = { cwd: sweetOptions.basicPath };

  // 绝对路径时移除cwd
  if (controllersInfo.isAbsolute) {
    options = _.omit(options, ['cwd']);
  }

  const files: Array<string> = await glob(controllersInfo.controllers, options);

  return requireControllers(files, sweetOptions, controllersInfo, clearRequireModule);
}