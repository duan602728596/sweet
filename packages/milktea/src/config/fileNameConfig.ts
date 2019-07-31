/**
 * 配置静态文件
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createFileName(isDevelopment: boolean): string {
  return `files/${ isDevelopment ? '[name]_[hash:5]' : '[hash:15]' }.[ext]`;
}

/**
 * 配置图片文件
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createImageName(isDevelopment: boolean): string {
  return `images/${ isDevelopment ? '[name]_[hash:5]' : '[hash:15]' }.[ext]`;
}