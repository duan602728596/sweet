/* 模块导入 */
export function requireModule(id: string): any | Promise<any> {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 判断模块是否存在 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/* 清除模块缓存（只用于开发环境） */
export function cleanRequireCache(id: any): void {
  const modulePath: string = require.resolve(id);
  const main: NodeJS.Module | null | undefined = require.main ?? module.parent;

  if (main) {
    main.children.splice(main.children.indexOf(id), 1);
  }

  delete require.cache[modulePath];
}

/* 模块导入并且清除缓存 */
export function deleteCacheAndRequireModule(id: string): any {
  cleanRequireCache(id);

  return requireModule(id);
}