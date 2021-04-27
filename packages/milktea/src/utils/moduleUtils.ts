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