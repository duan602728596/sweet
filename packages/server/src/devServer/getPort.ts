import chalk from 'chalk';
import { detectPort } from '../utils/utils.js';

/**
 * 判断端口是否被占用，并且返回新的可用的端口
 * @param { number } port: 端口号
 * @param { boolean } warn: 是否显示警告
 * @param { 'http' | 'https' } type: 警告的类型
 * @param { number } httpPort: 直接跳过http端口
 */
async function getPort(port: number, warn?: boolean, type?: 'http' | 'https', httpPort?: number): Promise<number> {
  const usePort: number = await detectPort(port, httpPort ? [httpPort] : undefined);

  if ((port !== usePort) && warn && type) {
    const oldPort: string = chalk.bold(String(port));
    const newPort: string = chalk.bold(String(usePort));
    const text: string = chalk.red(` - ${ type }端口 ${ oldPort } 已被占用，使用新的端口：${ newPort }。`);

    console.warn(text);
  }

  return usePort;
}

export default getPort;