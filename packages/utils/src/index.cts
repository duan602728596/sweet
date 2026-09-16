import * as fs from 'node:fs';

interface ModuleExport<T = unknown> {
  readonly default: T;
}

/**
 * 判断为module
 * @param { ModuleExport | unknown } module
 */
function isModule<T = unknown>(module: ModuleExport<T> | T): module is ModuleExport<T> {
  return typeof module === 'object' && module && ('default' in module);
}

/**
 * 判断为exportAll
 * @param { ModuleExport | unknown } module
 * @param { boolean } [exportAll]
 */
function isExportAllModule<T = unknown>(module: ModuleExport<T> | T, exportAll?: boolean): module is T {
  return !!exportAll;
}

/**
 * 模块导入
 * @param { string } id - 模块名称
 * @param { boolean } [exportAll] - 导出所有模块
 */
export function requireModule<T = unknown>(id: string, exportAll?: boolean): T {
  const module: ModuleExport<T> | T = require(id);

  if (isExportAllModule(module, exportAll)) {
    return module;
  }

  return isModule<T>(module) ? module.default : module;
}

/* 导入commonjs模块，cjs下和requireModule的行为相同 */
export const requireCommonjsModule: typeof requireModule = requireModule;

/**
 * 加载json文件
 * @param { string } id - 模块名称
 */
export function requireJson<T = unknown>(id: string): T {
  return requireModule<T>(id);
}

/**
 * 清除模块缓存
 * @param { string } id - 模块名称
 */
export function cleanRequireCache(id: string): void {
  const modulePath: string = require.resolve(id);

  if (require.main) {
    require.main.children.splice(require.main.children.indexOf(id as any), 1);
  }

  delete require.cache[modulePath];
}

/**
 * 清除缓存并且模块导入
 * @param { string } id - 模块名称
 * @param { boolean } [exportAll] - 导出所有模块
 */
export function requireModuleWithoutCache<T = unknown>(id: string, exportAll?: boolean): T {
  cleanRequireCache(id);

  return requireModule<T>(id, exportAll);
}

/**
 * 判断模块是否存在
 * @param { string } id - 模块名称
 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/**
 * 判断文件是否存在
 * @param { string } file - 文件路径
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
  cleanRequireCache,
  requireModuleWithoutCache,
  moduleExists,
  isFileExists
};