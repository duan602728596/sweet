import chalk from 'chalk';

/**
 * 计算进度百分比
 * @param { number } percentage: 进度
 */
function calculateProgress(percentage: number): string {
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  return pNumber[0];
}

/* 格式化dll的输出 */
export function handleDllProgress(percentage: number, message: string, ...args: Array<string>): void {
  console.info(chalk.white.bgGreen(`Dll: ${ calculateProgress(percentage) }%`), message, ...args);
}

/* 格式化输出 */
export function handleDefaultProgress(percentage: number, message: string, ...args: Array<string>): void {
  console.info(chalk.white.bgGreen(`Client: ${ calculateProgress(percentage) }%`), message, ...args);
}

/* 服务端渲染的格式化输出 */
export function handleServerRenderProgress(percentage: number, message: string, ...args: Array<string>): void {
  console.info(chalk.white.bgBlue(`Server: ${ calculateProgress(percentage) }%`), message, ...args);
}