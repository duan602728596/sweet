import * as detectPort from 'detect-port';
import * as chalk from 'chalk';

/**
 * 判断端口是否被占用
 * @param { number } port: 端口号
 * @param { 'http' | 'https' } type: 警告的类型
 */
async function portUse(port: number, type: 'http' | 'https'): Promise<number> {
  const usePort: number = await detectPort(port);

  if ((port !== usePort)) {
    const oldPort: string = chalk.bold(String(port));
    const text: string = chalk.red(` - ${ type }端口 ${ oldPort } 已被占用。`);

    console.warn(text);
  }

  return port;
}

export default portUse;