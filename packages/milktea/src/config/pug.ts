/* pug文件配置 */
import { LoaderOption } from '../utils/types';

interface PugOption {
  isDevelopment?: boolean;
}

export default function(options: PugOption = {}): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   */
  const { isDevelopment }: PugOption = options;

  return {
    loader: 'pug-loader',
    options: {
      pretty: isDevelopment,
      name: '[name].html'
    }
  };
}