/* sass-loader 配置 */

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   */
  const { isDevelopment }: { isDevelopment: boolean } = options;

  return {
    loader: 'sass-loader',
    options: {
      outputStyle: isDevelopment ? 'compact' : 'compressed'
    }
  };
}