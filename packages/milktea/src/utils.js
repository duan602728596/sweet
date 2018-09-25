export const isObject: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';

export const isArray: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';

export function handleWebpackProgress(percentage: number, ...args: any): void{
  const pNumber: number = percentage.toFixed(2);

  console.info(`${ pNumber * 100 }%`, ...args);
}