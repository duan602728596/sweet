enum FileName {
  Dev = '[name]_[hash:5]',
  Pro = '[name]_[hash:15]'
}

/**
 * 配置静态文件
 * @param { boolean } isDevelopment - 是否为开发环境
 */
function createFileName(isDevelopment: boolean): string {
  return `${ isDevelopment ? FileName.Dev : FileName.Pro }[ext]`;
}

export default createFileName;