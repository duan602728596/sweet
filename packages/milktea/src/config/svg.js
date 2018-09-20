/* svg文件配置 */

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   */
  const { isDevelopment }: { isDevelopment: boolean } = options;
  const fileName: string = isDevelopment ? '[name].[ext]' : '[hash:5].[ext]';

  return {
    loader: 'file-loader',
    options: {
      name: fileName,
      outputPath: 'image/'
    }
  };
}