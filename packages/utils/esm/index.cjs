import * as fs from 'node:fs';
/**
 * 判断为module
 * @param { ModuleExport | unknown } module
 */
function isModule(module) {
    return typeof module === 'object';
}
/**
 * 模块导入
 * @param { string } id: 模块名称
 * @param { boolean } exportAll: 导出所有模块
 */
export function requireModule(id, exportAll) {
    const module = require(id);
    if (exportAll) {
        return module;
    }
    return (isModule(module) && 'default' in module) ? module.default : module;
}
/* 导入commonjs模块，cjs下和requireModule的行为相同 */
export const requireCommonjsModule = requireModule;
/**
 * 加载json文件
 * @param { string } id: 模块名称
 */
export function requireJson(id) {
    return requireModule(id);
}
/**
 * 清除模块缓存
 * @param { string } id: 模块名称
 */
export function cleanRequireCache(id) {
    const modulePath = require.resolve(id);
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
export function requireModuleWithoutCache(id, exportAll) {
    cleanRequireCache(id);
    return requireModule(id, exportAll);
}
/**
 * 判断模块是否存在
 * @param { string } id: 模块名称
 */
export function moduleExists(id) {
    try {
        return require.resolve(id);
    }
    catch (err) {
        return false;
    }
}
/**
 * 判断文件是否存在
 * @param { string } file: 文件路径
 */
export async function isFileExists(file) {
    try {
        await fs.promises.access(file);
        return true;
    }
    catch (err) {
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
