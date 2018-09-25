export const isObject: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';

export const isArray: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';

export function handleWebpackProgress(percentage: any, message: any, ...args: any): void{
  console.info(percentage, message, ...args);
}