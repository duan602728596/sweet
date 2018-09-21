/* 字体文件配置 */

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * emitFile { boolean }: 是否生成文件
   */
  const { isDevelopment, emitFile }: {
    isDevelopment: boolean,
    emitFile: boolean
  } = options;
  const fileName: string = isDevelopment ? '[name].[ext]' : '[hash:5].[ext]';

  return {
    loader: 'file-loader',
    options: {
      name: fileName,
      outputPath: 'file/',
      emitFile
    }
  };
}