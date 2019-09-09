import * as detectPort from 'detect-port';
import * as colors from 'colors/safe';

/**
 * 判断端口是否被占用，并且返回新的可用的端口
 * @param { number } port: 端口号
 * @param { boolean } warn: 是否显示警告
 * @param { 'http' | 'https' } type: 警告的类型
 */
async function getPort(port: number, warn?: boolean, type?: 'http' | 'https'): Promise<number> {
  const usePort: number = await detectPort(port);

  if ((port !== usePort) && warn && type) {
    const oldPort: string = colors.bold(String(port));
    const newPort: string = colors.bold(String(usePort));
    const text: string = colors.red(`${ type }端口 ${ oldPort } 已被占用，使用新的端口：${ newPort }。`);

    console.warn(text);
  }

  return usePort;
}

export default getPort;