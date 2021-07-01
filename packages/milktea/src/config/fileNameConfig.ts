const devFilename: string = '[name]_[hash:5]',
  proFilename: string = '[name]_[hash:15]';

/**
 * 配置静态文件
 * @param { boolean } isDevelopment: 是否为开发环境
 */
function createFileName(isDevelopment: boolean): string {
  return `${ isDevelopment ? devFilename : proFilename }[ext]`;
}

export default createFileName;