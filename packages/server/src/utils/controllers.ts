import * as path from 'path';
import * as glob from 'glob';
import * as _ from 'lodash';
import { Context } from 'koa';
import { requireModule, globPromise } from './utils';
import useRegister from './babelRegister';
import { SweetOptions } from './types';

const defaultControllers: string = 'controllers';

/**
 * 获取controllers信息
 */
interface ControllersInfo {
  isAbsolute: boolean;
  dir: string;
  controllers: string;
}

export function getControllers(controllersDir?: string): ControllersInfo {
  const isAbsolute: boolean = controllersDir ? path.isAbsolute(controllersDir) : false;
  const dir: string = controllersDir ?? defaultControllers;
  const controllers: string = path.join(dir, '**/*.{js,jsx,ts,tsx}');

  return { isAbsolute, dir, controllers };
}

/**
 * 将路径转化成Map，key全部转换成小写
 * 小写用来兼容大小写查询，大写用来映射实际的文件
 */
export function pathArrayToMap(pathArr: Array<string>, basicPath: string, controllersInfo: ControllersInfo): Map<string, string> {
  const map: Map<string, string> = new Map();
  const replaceReg: RegExp = new RegExp(`^${ controllersInfo.dir.replace(/[\\/]/g, '[\/]') }[\/]`, 'ig');

  return _.transform(pathArr, function(result: Map<string, string>, value: string, index: number): void {
    const key: string = value.toLowerCase()
      .replace(replaceReg, '');

    result.set(key, controllersInfo.isAbsolute ? value : path.join(basicPath, value));
  }, map);
}

/* 获取函数 */
export async function getControllersFiles(basicPath: string, controllersDir?: string): Promise<Map<string, string>> {
  const controllersInfo: ControllersInfo = getControllers(controllersDir);
  let options: object = { cwd: basicPath };

  // 绝对路径时移除cwd
  if (controllersInfo.isAbsolute) {
    options = _.omit(options, ['cwd']);
  }

  const files: Array<string> = await globPromise(controllersInfo.controllers, options);

  return pathArrayToMap(files, basicPath, controllersInfo);
}

/* 获取函数 */
export function getControllersFilesSync(basicPath: string, controllersDir?: string): Map<string, string> {
  const controllersInfo: ControllersInfo = getControllers(controllersDir);
  let options: object = { cwd: basicPath };

  // 绝对路径时移除cwd
  if (controllersInfo.isAbsolute) {
    options = _.omit(options, ['cwd']);
  }

  const files: Array<string> = glob.sync(controllersInfo.controllers, options);

  return pathArrayToMap(files, basicPath, controllersInfo);
}

/**
 * 从controller中获取数据
 * @param { Context } ctx
 * @param { SweetOptions } sweetOptions
 * @param { Map<string, string> } controllersMap
 * @param { string } folderPathFile，path/to/file，没有扩展名
 * @param { string } formatFile，path.to.file，没有扩展名
 */
export async function getControllerData(
  ctx: Context,
  sweetOptions: SweetOptions,
  controllersMap: Map<string, string>,
  folderPathFile: string, // 查找文件夹
  formatFile: string      // 查找文件
): Promise<any> {
  // 文件的查找顺序
  const findFiles: Array<string> = [
    `${ folderPathFile }.ts`,
    `${ formatFile }.ts`,
    'default.ts',
    `${ folderPathFile }.js`,
    `${ formatFile }.js`,
    'default.js'
  ];
  let data: any = {};

  for (const findFile of findFiles) {
    if (controllersMap.has(findFile)) {
      const file: string | undefined = controllersMap.get(findFile);

      if (file) {
        useRegister(sweetOptions);

        const module: Function = requireModule(file);

        data = await module(ctx, sweetOptions);
        break;
      }
    }
  }

  return data;
}