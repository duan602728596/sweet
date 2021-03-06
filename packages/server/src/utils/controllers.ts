import * as path from 'path';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import * as _ from 'lodash';
import { requireModule, deleteCacheAndRequireModule, globPromise } from './utils';
import useRegister from './babelRegister';
import type { SweetOptions, ControllersModule } from './types';

const defaultControllers: string = 'controllers'; // 默认的controllers名

interface ControllersInfo {
  isAbsolute: boolean;
  dir: string;
  controllers: string;
}

/**
 * 获取controllers信息
 * @param { string } controllersDir: controllers的文件夹名
 */
export function getControllers(controllersDir?: string): ControllersInfo {
  const isAbsolute: boolean = controllersDir ? path.isAbsolute(controllersDir) : false;
  const dir: string = controllersDir ?? defaultControllers;
  const controllers: string = path.join(dir, '**/*.{js,jsx,ts,tsx}');

  return { isAbsolute, dir, controllers };
}

/**
 * 加载controllers目录下的模块
 * @param { Array<string> } files: 文件名
 * @param { SweetOptions } sweetOptions
 * @param { ControllersInfo } controllersInfo
 * @param { boolean } clearRequireModule: 是否清除缓存
 */
export function requireControllers(
  files: Array<string>,
  sweetOptions: SweetOptions,
  controllersInfo: ControllersInfo,
  clearRequireModule?: boolean
): Array<ControllersModule> {
  const result: Array<ControllersModule> = [],
    defaultResult: Array<ControllersModule> = [];

  for (const file of files) {
    useRegister(sweetOptions);

    const module: ControllersModule | undefined = (clearRequireModule ? deleteCacheAndRequireModule : requireModule)(
      controllersInfo.isAbsolute ? file : path.join(sweetOptions.basicPath, file));

    if (typeof module === 'object' && module.url && module.handler) {
      if (module.url === '(.*)' || module.url === '/(.*)') {
        defaultResult.push(module);
      } else {
        result.push(module);
      }
    }
  }

  return result.concat(defaultResult);
}

/**
 * 获取controllers目录下的所有模块
 * @param { SweetOptions } sweetOptions
 * @param { boolean } clearRequireModule: 是否清除缓存
 */
export async function getControllersFiles(sweetOptions: SweetOptions, clearRequireModule?: boolean): Promise<Array<ControllersModule>> {
  const controllersInfo: ControllersInfo = getControllers(sweetOptions.controllersDir);
  let options: IOptions = { cwd: sweetOptions.basicPath };

  // 绝对路径时移除cwd
  if (controllersInfo.isAbsolute) {
    options = _.omit(options, ['cwd']);
  }

  const files: Array<string> = await globPromise(controllersInfo.controllers, options);

  return requireControllers(files, sweetOptions, controllersInfo, clearRequireModule);
}

/**
 * 同步获取controllers目录下的所有模块
 * @param { SweetOptions } sweetOptions
 * @param { boolean } clearRequireModule: 是否清除缓存
 */
export function getControllersFilesSync(sweetOptions: SweetOptions, clearRequireModule?: boolean): Array<ControllersModule> {
  const controllersInfo: ControllersInfo = getControllers(sweetOptions.controllersDir);
  let options: IOptions = { cwd: sweetOptions.basicPath };

  // 绝对路径时移除cwd
  if (controllersInfo.isAbsolute) {
    options = _.omit(options, ['cwd']);
  }

  const files: Array<string> = glob.sync(controllersInfo.controllers, options);

  return requireControllers(files, sweetOptions, controllersInfo, clearRequireModule);
}