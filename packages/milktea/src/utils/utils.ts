/* 判断是否为对象 */
export function isObject<Data>(data: Data): boolean {
  return typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]';
}

/* 判断是否为数组 */
export function isArray<Data>(data: Data): boolean {
  return typeof data === 'object' && Object.prototype.toString.call(data) === '[object Array]';
}

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}