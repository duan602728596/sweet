import * as colors from 'colors/safe';

/**
 * 计算进度百分比
 * @param { number } percentage: 进度
 */
function calculateProgress(percentage: number): string {
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  return pNumber[0];
}

/* 格式化输出 */
export function handleDefaultProgress(percentage: number, message: string, ...args: Array<any>): void {
  console.info(colors.bgMagenta(`${ calculateProgress(percentage) }%`), message, ...args);
}

/* 服务端渲染的格式化输出 */
export function handleServerRenderProgress(percentage: number, message: string, ...args: Array<any>): void {
  console.info(colors.bgGreen(`${ calculateProgress(percentage) }%`), message, ...args);
}