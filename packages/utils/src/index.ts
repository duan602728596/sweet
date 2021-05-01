import fs from 'fs';

/**
 * 模块导入
 * @param { string } id: 模块名称
 * @param { boolean } exportAll: 导出所有模块
 */
export function requireModule(id: string, exportAll?: boolean): any | Promise<any> {
  const module: { default: any } | any = require(id);

  if (exportAll) {
    return module;
  }

  return (typeof module === 'object' && 'default' in module) ? module.default : module;
}

/* 导入commonjs模块，cjs下和requireModule的行为相同 */
export const requireCommonjsModule: typeof requireModule = requireModule;

/**
 * 加载json文件
 * @param { string } id: 模块名称
 */
export function requireJson(id: string): any | Promise<any> {
  return requireModule(id);
}

/**
 * 判断模块是否存在
 * @param { string } id: 模块名称
 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/**
 * 清除模块缓存
 * @param { string } id: 模块名称
 */
export function cleanRequireCache(id: any): void {
  const modulePath: string = require.resolve(id);

  if (require.main) {
    require.main.children.splice(require.main.children.indexOf(id), 1);
  }

  delete require.cache[modulePath];
}

/**
 * 清除缓存并且模块导入
 * @param { string } id: 模块名称
 * @param { boolean } exportAll: 导出所有模块
 */
export function deleteCacheAndRequireModule(id: string, exportAll?: boolean): any | Promise<any> {
  cleanRequireCache(id);

  return requireModule(id, exportAll);
}

/**
 * 判断文件是否存在
 * @param { string } file: 文件路径
 */
export async function isFileExists(file: string): Promise<boolean> {
  try {
    await fs.promises.access(file);

    return true;
  } catch (err) {
    return false;
  }
}

export default {
  requireModule,
  requireCommonjsModule,
  requireJson,
  moduleExists,
  cleanRequireCache,
  deleteCacheAndRequireModule,
  isFileExists
};