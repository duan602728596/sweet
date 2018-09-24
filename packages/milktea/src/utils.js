export const isObject: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';

export const isArray: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';