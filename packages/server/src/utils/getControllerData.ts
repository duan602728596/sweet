import * as Koa from 'koa';
import { SweetOptions } from './types';
import { requireModule } from './utils';

/**
 * 从controller中获取数据
 * @param { Koa.Context } ctx
 * @param { SweetOptions } sweetOptions
 * @param { Map<string, string> } controllersMap
 * @param { string } folderPathFile
 * @param { string } formatFile
 */
async function getControllerData(
  ctx: Koa.Context,
  sweetOptions: SweetOptions,
  controllersMap: Map<string, string>,
  folderPathFile: string,
  formatFile: string
): Promise<any> {
  let data: any = {};

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
  } else if (controllersMap.has('default.js')) {
    // 查找默认文件
    const defaultFile: string | undefined = controllersMap.get('default.js');

    if (defaultFile) {
      const module: Function = requireModule(defaultFile);

      data = await module(ctx, sweetOptions);
    }
  }

  return data;
}

export default getControllerData;