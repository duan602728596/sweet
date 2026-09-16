import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require: NodeRequire = createRequire(import.meta.url); // esm需要创建require

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
export async function requireModule<T = unknown>(id: string, exportAll?: boolean): Promise<T> {
  const fileUrl: string = (!id.includes('file://') && path.isAbsolute(id)) ? pathToFileURL(id).href : id;
  const module: ModuleExport<T> | T = await import(fileUrl);

  if (isExportAllModule<T>(module, exportAll)) {
    return module;
  }

  return isModule<T>(module) ? module.default : module;
}

/**
 * 模块导入
 * @param { string } id - 模块名称
 * @param { boolean } [exportAll] - 导出所有模块
 */
export function requireCommonjsModule<T = unknown>(id: string, exportAll?: boolean): T {
  const module: ModuleExport<T> | T = require(id);

  if (isExportAllModule<T>(module, exportAll)) {
    return module;
  }

  return isModule<T>(module) ? module.default : module;
}

/**
 * 加载json
 * @param { string } id - 模块名称
 */
export async function requireJson<T = unknown>(id: string): Promise<T> {
  const data: string = await fs.promises.readFile(id, {
    encoding: 'utf8'
  });

  return JSON.parse(data);
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

  return requireCommonjsModule<T>(id, exportAll);
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

/**
 * 从import.meta.url中解析__filename和__dirname
 * @param { string } metaUrl
 */
export function metaHelper(metaUrl: string): { __filename: string; __dirname: string } {
  const filename: string = fileURLToPath(metaUrl);
  const dirname: string = path.dirname(filename);

  return { __filename: filename, __dirname: dirname };
}

export default {
  requireModule,
  requireCommonjsModule,
  requireJson,
  cleanRequireCache,
  requireModuleWithoutCache,
  moduleExists,
  isFileExists,
  metaHelper
};