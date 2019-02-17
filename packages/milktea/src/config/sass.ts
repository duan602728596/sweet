/* sass-loader 配置 */
import { LoaderOption } from '../utils/types';

interface SassOption {
  isDevelopment?: boolean;
}

export default function(options: SassOption = {}): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   */
  const { isDevelopment }: SassOption = options;

  return {
    loader: 'sass-loader',
    options: {
      outputStyle: isDevelopment ? 'compact' : 'compressed',
      sourceMap: isDevelopment
    }
  };
}