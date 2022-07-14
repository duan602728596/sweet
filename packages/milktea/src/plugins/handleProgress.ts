// @ts-ignore Node16
import type Chalk from 'chalk';

/**
 * chalk
 */
async function getChalk(): Promise<typeof Chalk> {
  const chalkModule: { default: typeof Chalk } = await import('chalk');

  return chalkModule.default;
}

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
export async function handleDllProgress(percentage: number, message: string, ...args: Array<string>): Promise<void> {
  const chalk: typeof Chalk = await getChalk();

  console.info(chalk.white.bgGreen(`Dll: ${ calculateProgress(percentage) }%`), message, ...args);
}

/* 格式化输出 */
export async function handleDefaultProgress(percentage: number, message: string, ...args: Array<string>): Promise<void> {
  const chalk: typeof Chalk = await getChalk();

  console.info(chalk.white.bgGreen(`Client: ${ calculateProgress(percentage) }%`), message, ...args);
}

/* 服务端渲染的格式化输出 */
export async function handleServerRenderProgress(percentage: number, message: string, ...args: Array<string>): Promise<void> {
  const chalk: typeof Chalk = await getChalk();

  console.info(chalk.white.bgBlue(`Server: ${ calculateProgress(percentage) }%`), message, ...args);
}