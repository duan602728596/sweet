// 判断是否为对象
export const isObject: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';

// 判断是否为数组
export const isArray: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';

// 格式化输出
export function handleWebpackBuildProgress(percentage: number, message: any, ...args: any): void{
  const pNumber: number = percentage.toFixed(2);

  console.info('\x1B[34m%s\x1B[39m', `${ pNumber * 100 }%`, message, ...args);
}