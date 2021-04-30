/* 模块导入 */
export function requireModule(id: string): any | Promise<any> {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 加载json */
export function requireJson(id: string): Promise<any> {
  return requireModule(id);
}