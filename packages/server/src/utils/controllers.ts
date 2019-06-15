import * as path from 'path';
import * as glob from 'glob';
import * as _ from 'lodash';
import { Context } from 'koa';
import * as register from '@babel/register';
import registerConfig from './registerConfig';
import { SweetOptions } from './types';
import { requireModule } from './utils';

const controllers: string = 'controllers/**/*.javascript.ts';

/**
 * 将路径转化成Map，key全部转换成小写
 * 小写用来兼容大小写查询，大写用来映射实际的文件
 */
export function pathArrayToMap(pathArr: Array<string>, basicPath: string): Map<string, string> {
  const map: Map<string, string> = new Map();

  return _.transform(pathArr, function(result: Map<string, string>, value: string): void {
    const key: string = value.toLowerCase()
      .replace(/^controllers\//i, '');

    result.set(key, path.join(basicPath, value));
  }, map);
}

/* 获取函数 */
export function getControllersFiles(basicPath: string): Promise<Map<string, string>> {
  return new Promise((resolve: Function, reject: Function): void => {
    glob(controllers, {
      cwd: basicPath
    }, function(err: Error, files: Array<string>): void {
      resolve(pathArrayToMap(files, basicPath));
    });
  });
}

/* 获取函数 */
export function getControllersFilesSync(basicPath: string): Map<string, string> {
  const files: Array<string> = glob.sync(controllers, {
    cwd: basicPath
  });

  return pathArrayToMap(files, basicPath);
}

/**
 * 从controller中获取数据
 * @param { Context } ctx
 * @param { SweetOptions } sweetOptions
 * @param { Map<string, string> } controllersMap
 * @param { string } folderPathFile
 * @param { string } formatFile
 */
export async function getControllerData(
  ctx: Context,
  sweetOptions: SweetOptions,
  controllersMap: Map<string, string>,
  folderPathFile: string,
  formatFile: string
): Promise<any> {
  let data: any = {};

  register(registerConfig(sweetOptions));

  // 查找对应的controller文件
  if (controllersMap.has(folderPathFile)) {
    // 查找文件夹
    const file: string | undefined = controllersMap.get(folderPathFile);

    if (file) {
      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (controllersMap.has(formatFile)) {
    // 查找文件
    const file: string | undefined = controllersMap.get(formatFile);

    if (file) {
      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (controllersMap.has('default.javascript.ts')) {
    // 查找默认文件
    const defaultFile: string | undefined = controllersMap.get('default.javascript.ts');

    if (defaultFile) {
      const module: Function = requireModule(defaultFile);

      data = await module(ctx, sweetOptions);
    }
  }

  return data;
}