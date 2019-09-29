import * as detectPort from 'detect-port';
import * as colors from 'colors/safe';

/**
 * 判断端口是否被占用
 * @param { number } port: 端口号
 * @param { 'http' | 'https' } type: 警告的类型
 */
async function portUse(port: number, type: 'http' | 'https'): Promise<number> {
  const usePort: number = await detectPort(port);

  if ((port !== usePort)) {
    const oldPort: string = colors.bold(String(port));
    const text: string = colors.red(` - ${ type }端口 ${ oldPort } 已被占用。`);

    console.warn(text);
  }

  return port;
}

export default portUse;